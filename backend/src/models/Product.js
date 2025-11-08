const pool = require('../config/database');

class Product {
  static async create(productData) {
    const {
      title, sku, description, categoryId, brandId, oldPrice, newPrice,
      weight, stockQuantity, itemLeft, status, saleTag, location, primaryImage
    } = productData;
    const query = `
      INSERT INTO products (title, sku, description, category_id, brand_id, old_price, new_price,
                          weight, stock_quantity, item_left, status, sale_tag, location, primary_image)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
    const values = [title, sku, description, categoryId, brandId, oldPrice, newPrice,
                   weight, stockQuantity, itemLeft, status || 'In Stock', saleTag, location, primaryImage];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(options = {}) {
    const { limit = 50, offset = 0, categoryId, status, search } = options;
    let query = `
      SELECT p.*, c.name as category_name, b.name as brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (categoryId) {
      query += ` AND p.category_id = $${paramCount++}`;
      values.push(categoryId);
    }

    if (status) {
      query += ` AND p.status = $${paramCount++}`;
      values.push(status);
    }

    if (search) {
      query += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT p.*, c.name as category_name, b.name as brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async count(options = {}) {
    const { categoryId, status, search } = options;
    let query = 'SELECT COUNT(*) as count FROM products WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (categoryId) {
      query += ` AND category_id = $${paramCount++}`;
      values.push(categoryId);
    }

    if (status) {
      query += ` AND status = $${paramCount++}`;
      values.push(status);
    }

    if (search) {
      query += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      values.push(`%${search}%`);
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count);
  }

  static async update(id, productData) {
    const {
      title, sku, description, categoryId, brandId, oldPrice, newPrice,
      weight, stockQuantity, itemLeft, status, saleTag, location, primaryImage
    } = productData;
    const query = `
      UPDATE products 
      SET title = COALESCE($1, title),
          sku = COALESCE($2, sku),
          description = COALESCE($3, description),
          category_id = COALESCE($4, category_id),
          brand_id = COALESCE($5, brand_id),
          old_price = COALESCE($6, old_price),
          new_price = COALESCE($7, new_price),
          weight = COALESCE($8, weight),
          stock_quantity = COALESCE($9, stock_quantity),
          item_left = COALESCE($10, item_left),
          status = COALESCE($11, status),
          sale_tag = COALESCE($12, sale_tag),
          location = COALESCE($13, location),
          primary_image = COALESCE($14, primary_image),
          updated_at = current_timestamp
      WHERE id = $15
      RETURNING *
    `;
    const values = [title, sku, description, categoryId, brandId, oldPrice, newPrice,
                   weight, stockQuantity, itemLeft, status, saleTag, location, primaryImage, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = $1';
    await pool.query(query, [id]);
  }

  static async updateRating(id) {
    const query = `
      UPDATE products 
      SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM product_reviews
        WHERE product_id = $1 AND is_approved = true
      ),
      updated_at = current_timestamp
      WHERE id = $1
      RETURNING rating
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0]?.rating || 0;
  }
}

module.exports = Product;

