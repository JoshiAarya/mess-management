const jwt = require('jsonwebtoken');

// Static admin credentials (for development only)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check credentials
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: ADMIN_CREDENTIALS.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        username: ADMIN_CREDENTIALS.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 