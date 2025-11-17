const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

async function getStats(req, res, next) {
  try {
    // Get total counts
    const [totalProducts, totalCategories, totalOrders, totalRevenue] = await Promise.all([
      Product.count(),
      Category.count(),
      Order.count(),
      getTotalRevenue(),
    ]);

    // Get recent orders count (last 7 days)
    const recentOrders = await getRecentOrdersCount(7);

    // Get orders by status
    const ordersByStatus = await getOrdersByStatus();

    res.json({
      stats: {
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue,
        recentOrders,
        ordersByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getTotalRevenue() {
  const pool = require('../config/database');
  const query = `
    SELECT COALESCE(SUM(total_price), 0) as total_revenue
    FROM orders
    WHERE payment_status = 'completed' OR payment_status = 'paid'
  `;
  const result = await pool.query(query);
  return parseFloat(result.rows[0].total_revenue) || 0;
}

async function getRecentOrdersCount(days) {
  const pool = require('../config/database');
  const query = `
    SELECT COUNT(*) as count
    FROM orders
    WHERE created_at >= NOW() - INTERVAL '${days} days'
  `;
  const result = await pool.query(query);
  return parseInt(result.rows[0].count) || 0;
}

async function getOrdersByStatus() {
  const pool = require('../config/database');
  const query = `
    SELECT COALESCE(status, 'pending') as status, COUNT(*) as count
    FROM orders
    GROUP BY status
  `;
  const result = await pool.query(query);
  return result.rows.reduce((acc, row) => {
    acc[row.status] = parseInt(row.count) || 0;
    return acc;
  }, {});
}

module.exports = {
  getStats,
};

