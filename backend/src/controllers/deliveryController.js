const db = require('../config/database');

async function calculateDeliveryCharge(req, res, next) {
  try {
    const { state, items } = req.body;

    if (!state) {
      return res.status(400).json({ message: 'State is required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    // Get State ID
    const stateResult = await db.query('SELECT id FROM states WHERE name = $1', [state]);
    
    if (stateResult.rows.length === 0) {
      // If state not found, maybe return default or 0?
      // Or maybe the frontend sends state ID?
      // The frontend sends state name currently.
      // If state not found in DB, we can't calculate specific charge.
      return res.json({ deliveryCharge: 0, message: 'State not found for delivery calculation' });
    }

    const stateId = stateResult.rows[0].id;
    let totalDeliveryCharge = 0;

    for (const item of items) {
      // Item should have attributeValue (e.g., '250g') and quantity
      // If item doesn't have attributeValue, maybe it's a simple product?
      // We'll assume attributeValue is passed.
      
      const attributeValue = item.attributeValue || item.weight || item.size; // Fallback
      const quantity = parseInt(item.quantity) || 1;

      if (attributeValue) {
        const chargeResult = await db.query(
          'SELECT amount FROM delivery_charges WHERE state_id = $1 AND attribute_value = $2',
          [stateId, attributeValue]
        );

        if (chargeResult.rows.length > 0) {
          totalDeliveryCharge += parseFloat(chargeResult.rows[0].amount) * quantity;
        } else {
          // Default charge if specific attribute not found?
          // For now, 0.
        }
      }
    }

    res.json({ deliveryCharge: totalDeliveryCharge });
  } catch (error) {
    next(error);
  }
}

async function getDeliveryCharges(req, res, next) {
  try {
    const result = await db.query(`
      SELECT dc.id, dc.state_id, s.name as state_name, dc.attribute_value, dc.amount 
      FROM delivery_charges dc
      JOIN states s ON dc.state_id = s.id
      ORDER BY s.name, dc.attribute_value
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

async function createDeliveryCharge(req, res, next) {
  try {
    const { state_id, attribute_value, amount } = req.body;

    if (!state_id || !attribute_value || amount === undefined) {
      return res.status(400).json({ message: 'State, attribute value, and amount are required' });
    }

    const result = await db.query(
      'INSERT INTO delivery_charges (state_id, attribute_value, amount) VALUES ($1, $2, $3) RETURNING *',
      [state_id, attribute_value, amount]
    );

    res.status(201).json({ message: 'Delivery charge created successfully', charge: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') { // Unique violation
        return res.status(409).json({ message: 'A delivery charge for this state and attribute value already exists' });
    }
    next(error);
  }
}

async function updateDeliveryCharge(req, res, next) {
  try {
    const { id } = req.params;
    const { state_id, attribute_value, amount } = req.body;

    const result = await db.query(
      'UPDATE delivery_charges SET state_id = COALESCE($1, state_id), attribute_value = COALESCE($2, attribute_value), amount = COALESCE($3, amount), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [state_id, attribute_value, amount, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Delivery charge not found' });
    }

    res.json({ message: 'Delivery charge updated successfully', charge: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
        return res.status(409).json({ message: 'A delivery charge for this state and attribute value already exists' });
    }
    next(error);
  }
}

async function deleteDeliveryCharge(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM delivery_charges WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Delivery charge not found' });
    }

    res.json({ message: 'Delivery charge deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  calculateDeliveryCharge,
  getDeliveryCharges,
  createDeliveryCharge,
  updateDeliveryCharge,
  deleteDeliveryCharge
};
