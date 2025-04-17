const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  subscriptionAmount: {
    type: Number,
    required: [true, 'Please add subscription amount']
  },
  maxTiffinCount: {
    type: Number,
    required: [true, 'Please add maximum tiffin count']
  },
  remainingTiffinCount: {
    type: Number,
    default: function() {
      return this.maxTiffinCount;
    }
  },
  hostelName: {
    type: String,
    required: [true, 'Please add hostel name'],
    trim: true
  },
  collegeName: {
    type: String,
    required: [true, 'Please add college name'],
    trim: true
  },
  whatsappNumber: {
    type: String,
    required: [true, 'Please add WhatsApp number'],
    trim: true
  },
  totalPaidAmount: {
    type: Number,
    default: 0
  },
  paymentHistory: [{
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    description: {
      type: String,
      trim: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Member', memberSchema); 