/**
 * eSewa init and success redirect. Replace with real eSewa SDK as needed.
 */
const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
const backend = process.env.BACKEND_URL || 'http://localhost:5000';

/**
 * POST /api/payment/esewa/init - Initialize eSewa payment; returns redirect URL.
 */
export const esewaInit = async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;
    if (!orderId || !amount) return res.status(400).json({ message: 'orderId and amount required' });
    const clientId = process.env.ESEWA_CLIENT_ID;
    if (!clientId) return res.status(503).json({ message: 'eSewa not configured' });
    const successUrl = `${backend}/api/payment/esewa/success?orderId=${orderId}`;
    const failureUrl = `${frontend}/checkout?error=payment_failed`;
    const redirectUrl = `https://rc-epay.esewa.com.np/epay/main?amt=${amount}&pdc=0&psc=0&txAmt=0&tAmt=${amount}&pid=${orderId}&scd=${clientId}&su=${encodeURIComponent(successUrl)}&fu=${encodeURIComponent(failureUrl)}`;
    res.json({ redirectUrl });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/payment/esewa/success - eSewa success callback; redirect to frontend order success.
 */
export const esewaSuccess = async (req, res, next) => {
  try {
    const { orderId } = req.query;
    res.redirect(`${frontend}/order-success?orderId=${orderId || ''}`);
  } catch (err) {
    next(err);
  }
};
