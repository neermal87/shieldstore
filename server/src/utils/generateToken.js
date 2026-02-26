import jwt from 'jsonwebtoken';
import { getJwtSecret } from './jwtSecret.js';

/**
 * Generate JWT for user id. Used after login/register.
 */
export const generateToken = (id) =>
  jwt.sign({ id }, getJwtSecret(), { expiresIn: process.env.JWT_EXPIRE || '7d' });
