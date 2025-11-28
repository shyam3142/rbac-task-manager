const User = require('../models/User');

// GET /api/v1/users  (admin)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password'); // don't send password
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/users/:id  (admin)
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/users/:id/role  (admin)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Role updated', user });
  } catch (err) {
    next(err);
  }
};
