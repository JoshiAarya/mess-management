import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  isVegetarian: {
    type: Boolean,
    default: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const menuSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  items: [menuItemSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient date-based queries
menuSchema.index({ date: 1 });

// Method to get menu for a specific date
menuSchema.statics.getMenuByDate = async function(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.findOne({
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  });
};

const Menu = mongoose.model('Menu', menuSchema);

export default Menu; 