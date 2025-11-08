const pool = require('../config/database');

class Order {
  static async create(orderData) {
    const {
      userId, shippingAddressId, billingAddressId, shippingMethod,
      totalItems, subtotal, discountAmount, vat, totalPrice, couponCode,
      paymentMethod, paymentStatus
    } = orderData;
    
    // Generate unique order number
    const orderNumber = Date.now().toString();
    
    const query = `
      INSERT INTO orders (order_number, user_id, shipping_address_id, billing_address_id,
                         shipping_method, total_items, subtotal, discount_amount, vat,
                         total_price, coupon_code, payment_method, payment_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    const values = [orderNumber, userId, shippingAddressId, billingAddressId,
                   shippingMethod || 'free', totalItems, subtotal, discountAmount || 0,
                   vat || 0, totalPrice, couponCode, paymentMethod, paymentStatus || 'pending'];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT o.*, 
             sa.first_name as shipping_first_name, sa.last_name as shipping_last_name,
             sa.address_line as shipping_address, sa.city as shipping_city,
             sa.postal_code as shipping_postal_code, sa.country as shipping_country,
             ba.first_name as billing_first_name, ba.last_name as billing_last_name,
             ba.address_line as billing_address, ba.city as billing_city,
             ba.postal_code as billing_postal_code, ba.country as billing_country
      FROM orders o
      LEFT JOIN addresses sa ON o.shipping_address_id = sa.id
      LEFT JOIN addresses ba ON o.billing_address_id = ba.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT o.*, 
             sa.first_name as shipping_first_name, sa.last_name as shipping_last_name,
             sa.address_line as shipping_address, sa.city as shipping_city,
             sa.postal_code as shipping_postal_code, sa.country as shipping_country,
             ba.first_name as billing_first_name, ba.last_name as billing_last_name,
             ba.address_line as billing_address, ba.city as billing_city,
             ba.postal_code as billing_postal_code, ba.country as billing_country
      FROM orders o
      LEFT JOIN addresses sa ON o.shipping_address_id = sa.id
      LEFT JOIN addresses ba ON o.billing_address_id = ba.id
      WHERE o.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByOrderNumber(orderNumber) {
    const query = 'SELECT * FROM orders WHERE order_number = $1';
    const result = await pool.query(query, [orderNumber]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE orders 
      SET status = $1, updated_at = current_timestamp
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async updatePaymentStatus(id, paymentStatus) {
    const query = `
      UPDATE orders 
      SET payment_status = $1, updated_at = current_timestamp
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [paymentStatus, id]);
    return result.rows[0];
  }
}

module.exports = Order;

