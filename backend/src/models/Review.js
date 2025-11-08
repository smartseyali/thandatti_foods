const pool = require('../config/database');

class Review {
  static async create(reviewData) {
    const { productId, userId, rating, comment, avatarUrl } = reviewData;
    const query = `
      INSERT INTO product_reviews (product_id, user_id, rating, comment, avatar_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [productId, userId, rating, comment, avatarUrl];
    const result = await pool.query(query, values);
    
    // Update product rating
    const Product = require('./Product');
    await Product.updateRating(productId);
    
    return result.rows[0];
  }

  static async findByProductId(productId, options = {}) {
    const { limit = 50, offset = 0, approvedOnly = true } = options;
    let query = `
      SELECT pr.*, u.first_name, u.last_name, u.profile_photo
      FROM product_reviews pr
      JOIN users u ON pr.user_id = u.id
      WHERE pr.product_id = $1
    `;
    const values = [productId];
    let paramCount = 2;

    if (approvedOnly) {
      query += ` AND pr.is_approved = true`;
    }

    query += ` ORDER BY pr.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT pr.*, u.first_name, u.last_name, u.profile_photo
      FROM product_reviews pr
      JOIN users u ON pr.user_id = u.id
      WHERE pr.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, reviewData) {
    const { rating, comment } = reviewData;
    const query = `
      UPDATE product_reviews 
      SET rating = COALESCE($1, rating),
          comment = COALESCE($2, comment),
          updated_at = current_timestamp
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [rating, comment, id]);
    
    // Update product rating if rating changed
    if (rating) {
      const review = await this.findById(id);
      if (review) {
        const Product = require('./Product');
        await Product.updateRating(review.product_id);
      }
    }
    
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'SELECT product_id FROM product_reviews WHERE id = $1';
    const result = await pool.query(query, [id]);
    const productId = result.rows[0]?.product_id;
    
    await pool.query('DELETE FROM product_reviews WHERE id = $1', [id]);
    
    // Update product rating
    if (productId) {
      const Product = require('./Product');
      await Product.updateRating(productId);
    }
  }

  static async approve(id) {
    const query = `
      UPDATE product_reviews 
      SET is_approved = true, updated_at = current_timestamp
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    
    // Update product rating
    const review = result.rows[0];
    if (review) {
      const Product = require('./Product');
      await Product.updateRating(review.product_id);
    }
    
    return result.rows[0];
  }
}

module.exports = Review;

