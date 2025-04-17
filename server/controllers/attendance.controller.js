const Attendance = require('../models/Attendance');
const Member = require('../models/Member');

// @desc    Create or update attendance
// @route   POST /api/attendance
exports.createOrUpdateAttendance = async (req, res) => {
  try {
    const { date, members } = req.body;

    console.log(`Updating attendance for date: ${date}`);

    // Validate input
    if (!date || !Array.isArray(members)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data'
      });
    }

    // Process each member's attendance
    for (const member of members) {
      if (!member.userId) continue; // Skip if member ID is null

      // Find or create attendance record for this member and date
      let attendance = await Attendance.findOne({ userId: member.userId, date });

      if (attendance) {
        // Update existing attendance
        const previousLunch = attendance.lunch;
        const previousDinner = attendance.dinner;

        attendance.lunch = member.lunch;
        attendance.dinner = member.dinner;
        await attendance.save();

        // Update tiffin counts based on changes
        const memberDoc = await Member.findById(member.userId);
        if (memberDoc) {
          // Handle lunch changes
          if (member.lunch !== previousLunch) {
            if (member.lunch && memberDoc.remainingTiffinCount > 0) {
              await Member.findByIdAndUpdate(
                member.userId,
                { $inc: { remainingTiffinCount: -1 } }
              );
            } else if (!member.lunch && previousLunch) {
              await Member.findByIdAndUpdate(
                member.userId,
                { $inc: { remainingTiffinCount: 1 } }
              );
            }
          }

          // Handle dinner changes
          if (member.dinner !== previousDinner) {
            if (member.dinner && memberDoc.remainingTiffinCount > 0) {
              await Member.findByIdAndUpdate(
                member.userId,
                { $inc: { remainingTiffinCount: -1 } }
              );
            } else if (!member.dinner && previousDinner) {
              await Member.findByIdAndUpdate(
                member.userId,
                { $inc: { remainingTiffinCount: 1 } }
              );
            }
          }
        }
      } else {
        // Create new attendance record
        attendance = await Attendance.create({
          userId: member.userId,
          date,
          lunch: member.lunch,
          dinner: member.dinner
        });

        // Update tiffin counts for new records
        const memberDoc = await Member.findById(member.userId);
        if (memberDoc) {
          if (member.lunch && memberDoc.remainingTiffinCount > 0) {
            await Member.findByIdAndUpdate(
              member.userId,
              { $inc: { remainingTiffinCount: -1 } }
            );
          }
          if (member.dinner && memberDoc.remainingTiffinCount > 0) {
            await Member.findByIdAndUpdate(
              member.userId,
              { $inc: { remainingTiffinCount: -1 } }
            );
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: 'Attendance updated successfully'
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get attendance for a specific date
// @route   GET /api/attendance/:date
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const attendance = await Attendance.find({ date })
      .populate('userId', 'name email phoneNumber');

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get attendance for a specific member
// @route   GET /api/attendance/member/:userId
exports.getAttendanceByMember = async (req, res) => {
  try {
    const { userId } = req.params;

    const attendance = await Attendance.find({ userId })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error fetching member attendance:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get member attendance history
// @route   GET /api/attendance/member/:id
exports.getMemberAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const query = {
      'members.member': id
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendanceHistory = await Attendance.find(query)
      .select('date mealType members.$')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: attendanceHistory
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update single attendance record
// @route   PUT /api/attendance/:userId/:date/:meal
exports.updateSingleAttendance = async (req, res) => {
  try {
    const { userId, date, meal } = req.params;
    const { status } = req.body; // New status (true/false)

    if (!userId || !date || !meal || typeof status !== 'boolean') {
      return res.status(400).json({ success: false, error: 'Invalid input data' });
    }

    if (meal !== 'lunch' && meal !== 'dinner') {
       return res.status(400).json({ success: false, error: 'Invalid meal type' });
    }

    let attendance = await Attendance.findOne({ userId, date });
    const memberDoc = await Member.findById(userId);

    if (!memberDoc) {
        return res.status(404).json({ success: false, error: 'Member not found' });
    }

    let previousStatus = false;
    let tiffinChange = 0;

    if (attendance) {
      // Record exists, update it
      previousStatus = attendance[meal];
      // Only proceed if status is actually changing
      if (status !== previousStatus) {
          attendance[meal] = status;
          await attendance.save();
      } else {
          // If status isn't changing, no need to proceed further or change tiffins
          const currentMember = await Member.findById(userId); // Get current member for tiffin count
          return res.status(200).json({
              success: true,
              message: 'Attendance status unchanged.',
              data: {
                  attendance, // Return existing attendance
                  remainingTiffinCount: currentMember.remainingTiffinCount
              }
          });
      }
    } else {
      // No record exists, create it (only if status is true)
      if (status === true) {
          previousStatus = false; // Assuming default is false
          attendance = await Attendance.create({
            userId,
            date,
            [meal]: status,
            // Ensure the other meal defaults to false if creating new
            [meal === 'lunch' ? 'dinner' : 'lunch']: false
          });
      } else {
          // Trying to set to false when no record exists, do nothing.
           const currentMember = await Member.findById(userId); // Get current member for tiffin count
           return res.status(200).json({
                success: true,
                message: 'No attendance record exists to unset.',
                data: {
                    attendance: null, // No attendance record
                    remainingTiffinCount: currentMember.remainingTiffinCount
                }
            });
      }
    }

    // Calculate tiffin change only if status changed from false to true, or true to false
    if (status !== previousStatus) {
        if (status === true) { // Marked as present
            tiffinChange = -1;
        } else { // Marked as absent (reverted)
            tiffinChange = 1;
        }
    }

    // Apply tiffin change if necessary
    // Prevent count going below 0 when marking present, but allow increase when marking absent
    if (tiffinChange !== 0) {
        if (tiffinChange === -1 && memberDoc.remainingTiffinCount <= 0) {
            // Don't decrease if already 0 or less, but allow the attendance mark
             console.log(`Tiffin count for ${userId} (${memberDoc.name}) already <= 0. Attendance marked without tiffin deduction.`);
             // Still need to return the (unchanged) tiffin count
        } else {
             await Member.findByIdAndUpdate(userId, { $inc: { remainingTiffinCount: tiffinChange } });
        }
    }

    // Fetch the possibly updated attendance record and member to return latest state
    const finalAttendance = await Attendance.findOne({ userId, date }).populate('userId', 'name');
    const finalMember = await Member.findById(userId);

    res.status(200).json({
      success: true,
      data: {
          attendance: finalAttendance, // Return updated/created record (or existing if no change needed)
          remainingTiffinCount: finalMember.remainingTiffinCount // Send back updated count
      }
    });

  } catch (error) {
    console.error('Error updating single attendance:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get count of attendance for today
// @route   GET /api/attendance/today/count
exports.getTodaysAttendanceCount = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set to start of next day

    // Count documents where the date is today and either lunch or dinner is true
    const count = await Attendance.countDocuments({
      date: {
        $gte: today,
        $lt: tomorrow
      },
      $or: [{ lunch: true }, { dinner: true }]
    });

    res.status(200).json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Error fetching today\'s attendance count:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

module.exports = {
  createOrUpdateAttendance: exports.createOrUpdateAttendance,
  getAttendanceByDate: exports.getAttendanceByDate,
  getAttendanceByMember: exports.getAttendanceByMember,
  getMemberAttendance: exports.getMemberAttendance,
  updateSingleAttendance: exports.updateSingleAttendance,
  getTodaysAttendanceCount: exports.getTodaysAttendanceCount
}; 