const pool = require('../config/database');

class Category {
  static async create(categoryData) {
    const { name, slug, description, image, parentId } = categoryData;
    const query = `
      INSERT INTO categories (name, slug, description, image, parent_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [name, slug, description, image, parentId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM categories ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findBySlug(slug) {
    const query = 'SELECT * FROM categories WHERE slug = $1';
    const result = await pool.query(query, [slug]);
    return result.rows[0];
  }

  static async update(id, categoryData) {
    const { name, slug, description, image, parentId } = categoryData;
    const query = `
      UPDATE categories 
      SET name = COALESCE($1, name),
          slug = COALESCE($2, slug),
          description = COALESCE($3, description),
          image = COALESCE($4, image),
          parent_id = COALESCE($5, parent_id),
          updated_at = current_timestamp
      WHERE id = $6
      RETURNING *
    `;
    const values = [name, slug, description, image, parentId, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM categories WHERE id = $1';
    await pool.query(query, [id]);
  }

  static async getProductCount(id) {
    const query = 'SELECT COUNT(*) as count FROM products WHERE category_id = $1';
    const result = await pool.query(query, [id]);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Category;

