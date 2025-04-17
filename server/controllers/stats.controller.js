const Member = require('../models/Member');

// @desc    Get total monthly revenue (sum of all members' subscription amounts)
// @route   GET /api/stats/monthly-revenue
exports.getMonthlyRevenue = async (req, res) => {
  try {
    const result = await Member.aggregate([
      {
        $group: {
          _id: null, // Group all members together
          totalRevenue: { $sum: '$subscriptionAmount' } // Sum their subscription amounts
        }
      }
    ]);

    const revenue = result.length > 0 ? result[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      revenue: revenue
    });
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 