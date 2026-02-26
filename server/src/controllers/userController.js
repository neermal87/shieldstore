import User from '../models/User.js';

/**
 * GET /api/users - List users (admin only).
 */
export const list = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt').lean();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:id - Get user (admin or self).
 */
export const getOne = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/users/profile - Update current user profile.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { name, phone, address } = req.body;
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone, address: user.address });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/users/:id/role - Update user role (admin only).
 */
export const updateRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { role } = req.body;
    if (['user', 'admin'].includes(role)) {
      user.role = role;
      await user.save();
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};
