import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getJwtSecret } from '../utils/jwtSecret.js';

const getToken = (req) =>
  req.cookies?.token ||
  (req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null);

/**
 * Protect routes: require valid JWT. Sets req.user.
 */
export const protect = async (req, res, next) => {
  const token = getToken(req);
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

/**
 * Restrict to admin role. Use after protect.
 */
export const admin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access required' });
};

/**
 * Optional auth: set req.user if token present, else req.user = null.
 */
export const optionalAuth = async (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = await User.findById(decoded.id).select('-password');
  } catch {
    req.user = null;
  }
  next();
};
