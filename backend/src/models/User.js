const pool = require('../config/database');

class User {
  static async create(userData) {
    const { email, passwordHash, firstName, lastName, phoneNumber, profilePhoto, description, role } = userData;
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, phone_number, profile_photo, description, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, first_name, last_name, phone_number, profile_photo, description, is_active, role, created_at, updated_at
    `;
    const values = [email, passwordHash, firstName, lastName, phoneNumber, profilePhoto, description, role || 'customer'];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findByPhoneNumber(phoneNumber) {
    const query = 'SELECT * FROM users WHERE phone_number = $1';
    const result = await pool.query(query, [phoneNumber]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, first_name, last_name, phone_number, profile_photo, description, is_active, role, created_at, updated_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, userData) {
    const { firstName, lastName, phoneNumber, profilePhoto, description } = userData;
    const query = `
      UPDATE users 
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          phone_number = COALESCE($3, phone_number),
          profile_photo = COALESCE($4, profile_photo),
          description = COALESCE($5, description),
          updated_at = current_timestamp
      WHERE id = $6
      RETURNING id, email, first_name, last_name, phone_number, profile_photo, description, is_active, role, created_at, updated_at
    `;
    const values = [firstName, lastName, phoneNumber, profilePhoto, description, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updatePassword(id, passwordHash) {
    const query = `
      UPDATE users 
      SET password_hash = $1, updated_at = current_timestamp
      WHERE id = $2
    `;
    await pool.query(query, [passwordHash, id]);
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await pool.query(query, [id]);
  }
}

module.exports = User;

