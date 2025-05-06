import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { items, discounts, totalPayable, paymentMethod } = req.body;

    // Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    if (!paymentMethod || !['cash', 'qris'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const order = new Order({
      items,
      discounts,
      totalPayable,
      paymentMethod,
      paymentStatus: 'pending',
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem')
      .populate('items.variantSelections.variant')
      .populate('discounts.discountItem');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error });
  }
};
