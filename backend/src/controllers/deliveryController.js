const db = require('../config/database');

// Helper to parse weight string to grams
function parseWeightToGrams(weightStr) {
  if (!weightStr) return 0;
  if (typeof weightStr === 'number') return weightStr;
  
  const normalized = weightStr.toString().toLowerCase().trim().replace(/\s/g, '');
  const value = parseFloat(normalized);
  if (isNaN(value)) return 0;

  if (normalized.includes('kg')) {
    return value * 1000;
  } else if (normalized.includes('g') || normalized.includes('ml')) {
    return value;
  }
  return 0;
}

// Helper: Calculate charge from tariffs table
async function calculateFromTariffs(totalGrams, zone) {
    if (!zone) zone = 'REST'; 

    // Find the slab where max_weight >= totalGrams, ordered by max_weight ASC
    // The first one that fits is our slab.
    const result = await db.query(
        `SELECT prices FROM delivery_tariffs WHERE max_weight >= $1 ORDER BY max_weight ASC LIMIT 1`,
        [totalGrams]
    );

    if (result.rows.length > 0) {
        const prices = result.rows[0].prices;
        // prices is JSONB { "TN": 40, "SOUTH": 55, ... }
        let price = prices[zone];
        
        // Fallback for missing zone price to REST
        if (price === undefined || price === null || price === 0) {
            price = prices['REST'];
        }
        
        return parseFloat(price || 0);
    } else {
        // Exceeds max slab. Use the largest available slab?
        // Or throw error? Usually stick to max cost.
        const maxResult = await db.query(
            `SELECT prices FROM delivery_tariffs ORDER BY max_weight DESC LIMIT 1`
        );
        if (maxResult.rows.length > 0) {
            const prices = maxResult.rows[0].prices;
            let price = prices[zone];
            if (price === undefined || price === null || price === 0) {
                price = prices['REST'];
            }
            return parseFloat(price || 0);
        }
    }
    return 0;
}

async function calculateDeliveryCharge(req, res, next) {
  try {
    const { state, items } = req.body;

    if (!state) return res.status(400).json({ message: 'State is required' });
    if (!items || !Array.isArray(items)) return res.status(400).json({ message: 'Items are required' });

    // Get State Zone
    const stateResult = await db.query('SELECT zone FROM states WHERE name = $1', [state]);
    let zone = 'REST';
    if (stateResult.rows.length > 0) {
        zone = stateResult.rows[0].zone || 'REST';
    } else {
        // State not found? Maybe treat as REST or return error. 
        // Returning REST is safer.
        console.warn(`State '${state}' not found. Defaulting to REST zone.`);
    }

    // Calculate total weight
    let totalGrams = 0;
    for (const item of items) {
       const weightStr = item.attributeValue || item.weight || item.size || '0g';
       const quantity = parseInt(item.quantity) || 1;
       const grams = parseWeightToGrams(weightStr);
       totalGrams += grams * quantity;
    }
    
    // Fallback: assume 250g per item if 0
    if (totalGrams === 0 && items.length > 0) {
      items.forEach(item => totalGrams += 250 * (parseInt(item.quantity) || 1));
    }

    // Calculate Charge
    const deliveryCharge = await calculateFromTariffs(totalGrams, zone);

    return res.json({ 
        deliveryCharge, 
        method: 'zone_slab_db', 
        zone, 
        totalWeight: totalGrams 
    });

  } catch (error) {
    next(error);
  }
}

// --- ADMIN ENDPOINTS ---

async function getAdminDeliveryData(req, res, next) {
    try {
        // Get Tariffs
        const tariffs = await db.query('SELECT * FROM delivery_tariffs ORDER BY max_weight ASC');
        
        // Get States with Zones
        const states = await db.query('SELECT id, name, zone FROM states ORDER BY name ASC');
        
        res.json({
            tariffs: tariffs.rows,
            states: states.rows
        });
    } catch(e) { next(e); }
}

async function createTariff(req, res, next) {
    try {
        const { max_weight, prices } = req.body;
        if (!max_weight || !prices) return res.status(400).json({message: 'Missing fields'});
        
        const result = await db.query(
            'INSERT INTO delivery_tariffs (max_weight, prices) VALUES ($1, $2) RETURNING *',
            [max_weight, JSON.stringify(prices)]
        );
        res.status(201).json(result.rows[0]);
    } catch(e) { next(e); }
}

async function updateTariff(req, res, next) {
    try {
        const { id } = req.params;
        const { max_weight, prices } = req.body;
        
        const result = await db.query(
            'UPDATE delivery_tariffs SET max_weight = COALESCE($1, max_weight), prices = COALESCE($2, prices), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
            [max_weight, prices ? JSON.stringify(prices) : undefined, id]
        );
        
        if (result.rows.length === 0) return res.status(404).json({message: 'Tariff not found'});
        res.json(result.rows[0]);
    } catch(e) { next(e); }
}

async function deleteTariff(req, res, next) {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM delivery_tariffs WHERE id = $1', [id]);
        res.json({message: 'Deleted'});
    } catch(e) { next(e); }
}

async function updateStateZone(req, res, next) {
    try {
        const { id } = req.params;
        const { zone } = req.body;
        if (!zone) return res.status(400).json({message: 'Zone required'});
        
        const result = await db.query(
            'UPDATE states SET zone = $1 WHERE id = $2 RETURNING *',
            [zone, id]
        );
        
        if (result.rows.length === 0) return res.status(404).json({message: 'State not found'});
        res.json(result.rows[0]);
    } catch(e) { next(e); }
}

async function bulkUpdateStateZones(req, res, next) {
    try {
        const { stateIds, zone } = req.body;
        if (!stateIds || !Array.isArray(stateIds) || !zone) return res.status(400).json({message: 'Invalid input'});
        
        await db.query(`UPDATE states SET zone = $1 WHERE id = ANY($2::int[])`, [zone, stateIds]);
        res.json({message: 'Updated successfully'});
    } catch(e) { next(e); }
}

// Legacy (Keep for backward compatibility if needed, but exports updated to point here)
// Just proxying or removing old unused ones from exports
async function getDeliveryCharges(req, res, next) {
    // Return empty or legacy if frontend expects it, but we are moving to new admin panel
    return getAdminDeliveryData(req, res, next); 
}

// Stub old create/update/delete delivery charge to avoid crash if routes exist
const createDeliveryCharge = async (req, res) => res.status(410).json({message: 'Deprecated'});
const updateDeliveryCharge = async (req, res) => res.status(410).json({message: 'Deprecated'});
const deleteDeliveryCharge = async (req, res) => res.status(410).json({message: 'Deprecated'});
const saveDeliveryRule = async (req, res) => res.status(410).json({message: 'Deprecated'});
const deleteDeliveryRule = async (req, res) => res.status(410).json({message: 'Deprecated'});


module.exports = {
  calculateDeliveryCharge,
  getAdminDeliveryData,
  createTariff,
  updateTariff,
  deleteTariff,
  updateStateZone,
  bulkUpdateStateZones,
  // Maintain interface for routes if they are not updated yet
  getDeliveryCharges, 
  createDeliveryCharge,
  updateDeliveryCharge,
  deleteDeliveryCharge,
  saveDeliveryRule,
  deleteDeliveryRule
};
