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
      SELECT dc.id, s.name as state_name, dc.attribute_value, dc.amount 
      FROM delivery_charges dc
      JOIN states s ON dc.state_id = s.id
      ORDER BY s.name, dc.attribute_value
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  calculateDeliveryCharge,
  getDeliveryCharges
};
