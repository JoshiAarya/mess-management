import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  price: {
    type: Number,
    required: true
  },
  mealsPerDay: {
    type: Number,
    required: true,
    default: 2 // Default 2 meals per day
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentHistory: [{
    amount: Number,
    date: Date,
    status: String,
    transactionId: String
  }]
}, {
  timestamps: true
});

// Method to check if subscription is active
subscriptionSchema.methods.isActive = function() {
  const now = new Date();
  return this.status === 'active' && now >= this.startDate && now <= this.endDate;
};

// Method to calculate remaining days
subscriptionSchema.methods.getRemainingDays = function() {
  if (!this.isActive()) return 0;
  const now = new Date();
  const diffTime = this.endDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription; 