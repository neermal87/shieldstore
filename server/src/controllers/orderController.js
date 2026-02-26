import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * POST /api/orders - Create order (protected or guest with shippingAddress).
 */
export const create = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    if (!orderItems?.length || !shippingAddress?.fullName || !shippingAddress?.email || !shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.country) {
      return res.status(400).json({ message: 'Missing order items or shipping address fields' });
    }

    let itemsPrice = 0;
    const resolvedItems = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(400).json({ message: `Product not found: ${item.product}` });
      const qty = Math.max(1, parseInt(item.qty) || 1);
      const price = product.price;
      itemsPrice += price * qty;
      resolvedItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price,
        qty,
      });
    }

    const taxPrice = Math.round(itemsPrice * 0.1);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = await Order.create({
      user: req.user?._id || null,
      orderItems: resolvedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'esewa',
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: 'pending',
    });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/orders - List orders for current user or all for admin.
 */
export const list = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(filter).sort('-createdAt').populate('user', 'name email').lean();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/orders/:id - Get single order.
 */
export const getOne = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user?.role !== 'admin' && order.user?._id?.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/orders/:id/status - Update order status (admin).
 */
export const updateStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const { status } = req.body;
    if (['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      order.status = status;
      if (status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      }
      await order.save();
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};
