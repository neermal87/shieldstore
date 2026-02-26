/**
 * Returns JWT secret from env or dev fallback to avoid "secretOrPrivateKey must have a value".
 */
export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production');
  }
  console.warn('Warning: JWT_SECRET not set, using dev default.');
  return 'shield-ecommerce-dev-secret';
};
