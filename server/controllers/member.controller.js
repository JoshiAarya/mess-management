const Member = require('../models/Member');

// @desc    Add a new member
// @route   POST /api/members
exports.addMember = async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all members
// @route   GET /api/members
exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update a member
// @route   PUT /api/members/:id
exports.updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete a member
// @route   DELETE /api/members/:id
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get a single member
// @route   GET /api/members/:id
exports.getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Reset tiffin counts for all members
// @route   PUT /api/members/reset-tiffin
exports.resetTiffinCounts = async (req, res) => {
  try {
    const members = await Member.find();
    
    for (const member of members) {
      member.remainingTiffinCount = member.maxTiffinCount;
      await member.save();
    }

    res.status(200).json({
      success: true,
      message: 'Tiffin counts reset successfully',
      data: members
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get members with exhausted tiffin counts
// @route   GET /api/members/exhausted-tiffin
exports.getExhaustedTiffinMembers = async (req, res) => {
  try {
    const members = await Member.find({ remainingTiffinCount: { $lte: 0 } });
    
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Reactivate a member (update subscription and reset tiffin count)
// @route   PUT /api/members/:id/reactivate
exports.reactivateMember = async (req, res) => {
  try {
    const { subscriptionAmount, maxTiffinCount } = req.body;
    const memberId = req.params.id;

    // Validate input
    if (typeof subscriptionAmount !== 'number' || typeof maxTiffinCount !== 'number' || subscriptionAmount <= 0 || maxTiffinCount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid subscription amount or max tiffin count'
      });
    }

    const member = await Member.findByIdAndUpdate(
      memberId,
      {
        subscriptionAmount,
        maxTiffinCount,
        remainingTiffinCount: maxTiffinCount, // Reset remaining count
        totalPaidAmount: 0, // Reset total paid amount
        paymentHistory: [] // Clear payment history
      },
      {
        new: true, // Return the updated document
        runValidators: true // Ensure schema validation runs
      }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Member reactivated successfully',
      data: member
    });

  } catch (error) {
    console.error('Error reactivating member:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Record a payment for a member
// @route   POST /api/members/:id/payment
exports.recordPayment = async (req, res) => {
  try {
    let { amount, description } = req.body;
    const memberId = req.params.id;

    // Parse amount as a number
    amount = parseFloat(amount);

    // Validate input
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid payment amount'
      });
    }

    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }

    // Check if the payment exceeds the subscription amount
    if (member.totalPaidAmount + amount > member.subscriptionAmount) {
      return res.status(400).json({
        success: false,
        error: 'Payment exceeds the subscription amount'
      });
    }

    // Update member's payment information
    member.totalPaidAmount += amount;
    member.paymentHistory.push({
      amount,
      description: description || 'Payment received'
    });

    await member.save();

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 