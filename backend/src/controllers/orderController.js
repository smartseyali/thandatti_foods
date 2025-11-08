const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');

async function getUserOrders(req, res, next) {
  try {
    const orders = await Order.findByUserId(req.userId);
    
    // Get order items for each order
    for (let order of orders) {
      order.items = await OrderItem.findByOrderId(order.id);
    }

    res.json({ orders });
  } catch (error) {
    next(error);
  }
}

async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order (unless admin)
    if (order.user_id !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.items = await OrderItem.findByOrderId(order.id);

    res.json({ order });
  } catch (error) {
    next(error);
  }
}

async function createOrder(req, res, next) {
  try {
    const {
      shippingAddressId,
      billingAddressId,
      shippingMethod,
      items,
      couponCode,
      paymentMethod,
    } = req.body;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const itemTotal = parseFloat(item.price) * parseInt(item.quantity);
      subtotal += itemTotal;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: itemTotal,
      });
    }

    // Apply coupon if provided
    let discountAmount = 0;
    let couponId = null;
    if (couponCode) {
      const couponValidation = await Coupon.validate(couponCode, req.userId, subtotal);
      if (couponValidation.valid) {
        discountAmount = couponValidation.discountAmount;
        couponId = couponValidation.coupon.id;
      } else {
        return res.status(400).json({ message: couponValidation.message });
      }
    }

    const vat = subtotal * 0.18; // 18% VAT (adjust as needed)
    const totalPrice = subtotal + vat - discountAmount;

    // Create order
    const orderData = {
      userId: req.userId,
      shippingAddressId,
      billingAddressId,
      shippingMethod: shippingMethod || 'free',
      totalItems: items.reduce((sum, item) => sum + parseInt(item.quantity), 0),
      subtotal,
      discountAmount,
      vat,
      totalPrice,
      couponCode: couponCode || null,
      paymentMethod,
      paymentStatus: 'pending',
    };

    const order = await Order.create(orderData);

    // Create order items
    const orderItemsData = orderItems.map(item => ({
      ...item,
      orderId: order.id,
    }));
    await OrderItem.createBulk(orderItemsData);

    // Record coupon usage if applicable
    if (couponId) {
      await Coupon.recordUsage(couponId, req.userId, order.id, discountAmount);
    }

    // Clear cart
    await Cart.clear(req.userId);

    // Get order with items
    order.items = await OrderItem.findByOrderId(order.id);

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const order = await Order.updateStatus(id, status);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
};

