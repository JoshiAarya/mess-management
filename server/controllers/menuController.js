import Menu from '../models/Menu.js';

// Create new menu
export const createMenu = async (req, res) => {
  try {
    const { date, items, notes } = req.body;

    // Check if menu already exists for the date
    const existingMenu = await Menu.findOne({ date });
    if (existingMenu) {
      return res.status(400).json({ message: 'Menu already exists for this date' });
    }

    const menu = new Menu({
      date,
      items,
      notes,
      createdBy: req.user._id
    });

    await menu.save();
    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu', error: error.message });
  }
};

// Get today's menu
export const getTodaysMenu = async (req, res) => {
  try {
    const today = new Date();
    const menu = await Menu.getMenuByDate(today);

    if (!menu) {
      return res.status(404).json({ message: 'No menu available for today' });
    }

    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu', error: error.message });
  }
};

// Get menu by date
export const getMenuByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const menu = await Menu.getMenuByDate(date);

    if (!menu) {
      return res.status(404).json({ message: 'No menu available for this date' });
    }

    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu', error: error.message });
  }
};

// Update menu
export const updateMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const updates = req.body;

    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      menu[key] = updates[key];
    });

    await menu.save();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu', error: error.message });
  }
};

// Delete menu
export const deleteMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const menu = await Menu.findByIdAndDelete(menuId);

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json({ message: 'Menu deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu', error: error.message });
  }
};

// Get menus by date range
export const getMenusByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const menus = await Menu.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1 });

    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menus', error: error.message });
  }
}; 