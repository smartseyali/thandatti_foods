const db = require('../config/database');

// Helper to parse unit string to value and type
function parseItemUnit(unitStr) {
  if (!unitStr) return { value: 0, type: 'WEIGHT' };

  const normalized = unitStr.toString().toLowerCase().trim().replace(/\s/g, '');
  
  // Extract numerical value
  const valueMatch = normalized.match(/(\d+\.?\d*)/);
  const value = valueMatch ? parseFloat(valueMatch[0]) : NaN;
  
  if (isNaN(value)) return { value: 0, type: 'WEIGHT' };

  // Volume detection (ml, l, liter, litre)
  const isVolume = normalized.includes('ml') || 
                   normalized.includes('liter') || 
                   normalized.includes('litre') || 
                   (normalized.endsWith('l') && !normalized.includes('ml') && !normalized.includes('lb'));

  if (isVolume) {
    const mlValue = (normalized.includes('ml')) ? value : value * 1000;
    return { value: mlValue, type: 'VOLUME' };
  }

  // Weight detection (kg, g, gram)
  const isWeight = normalized.includes('kg') || 
                   normalized.includes('g') || 
                   normalized.includes('gram');

  if (isWeight) {
    const gValue = (normalized.includes('kg')) ? value * 1000 : value;
    return { value: gValue, type: 'WEIGHT' };
  }
  
  // Default to 0 if no clear unit signature is found (so fallback logic can trigger)
  return { value: 0, type: 'WEIGHT' };
}

// Helper: Calculate charge from tariffs table
async function calculateFromTariffs(totalUnits, zone, type = 'WEIGHT') {
    if (totalUnits <= 0) return 0;
    if (!zone) zone = 'REST'; 

    // Find the slab where max_weight >= totalUnits and tariff_type matches
    // Note: We use max_weight column for both weight and volume(ml) limits
    const result = await db.query(
        `SELECT prices FROM delivery_tariffs WHERE max_weight >= $1 AND tariff_type = $2 ORDER BY max_weight ASC LIMIT 1`,
        [totalUnits, type]
    );

    if (result.rows.length > 0) {
        const prices = result.rows[0].prices;
        let price = prices[zone];
        
        if (price === undefined || price === null || price === 0) {
            price = prices['REST'];
        }
        
        return parseFloat(price || 0);
    } else {
        // Exceeds max slab. Use the largest available slab for this type
        const maxResult = await db.query(
            `SELECT prices FROM delivery_tariffs WHERE tariff_type = $1 ORDER BY max_weight DESC LIMIT 1`,
            [type]
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
        console.warn(`State '${state}' not found. Defaulting to REST zone.`);
    }

    // Calculate total weight and volume
    let totalGrams = 0;
    let totalMl = 0;

    console.log(`[DELIVERY] Calculating for state: ${state}, Zone: ${zone}`);

    for (const item of items) {
       // Check available properties for unit string
       const unitStr = (item.attributeValue || item.weight || item.size || '').toString();
       const title = (item.title || item.name || '').toString();
       const quantity = parseInt(item.quantity) || 1;
       
       let { value, type } = parseItemUnit(unitStr);
       
       // Special handling for Oil products if unit is ambiguous or missing
       if (value === 0 && title.toLowerCase().includes('oil')) {
           console.log(`[DELIVERY] Product "${title}" identified as Oil by keyword. Defaulting to 1000ml volume.`);
           value = 1000;
           type = 'VOLUME';
       }

       console.log(`[DELIVERY] Item: "${title}" (${unitStr}) -> Parsed: ${value}${type === 'VOLUME' ? 'ml' : 'g'} x ${quantity}`);

       if (type === 'VOLUME' && value > 0) {
           totalMl += (value * quantity);
       } else if (type === 'WEIGHT' && value > 0) {
           totalGrams += (value * quantity);
       } else {
           // Fallback for items with no clear weight/volume
           // Default to 250g as a safe minimum weight per item
           console.log(`[DELIVERY] Fallback 250g active for item: "${title}"`);
           totalGrams += (250 * quantity);
       }
    }

    // Ensure we handle case where items exist but totals are still 0
    if (items.length > 0 && totalGrams === 0 && totalMl === 0) {
        totalGrams = items.reduce((sum, item) => sum + (250 * (parseInt(item.quantity) || 1)), 0);
        console.log(`[DELIVERY] Safety valve: forced totalGrams to ${totalGrams}`);
    }

    // Calculate Charges independently
    const weightCharge = await calculateFromTariffs(totalGrams, zone, 'WEIGHT');
    const volumeCharge = await calculateFromTariffs(totalMl, zone, 'VOLUME');

    // sum both charges for mixed orders
    const totalDeliveryCharge = Math.ceil(Number(weightCharge || 0) + Number(volumeCharge || 0));

    console.log(`[DELIVERY] Final Results -> Grams: ${totalGrams}, Ml: ${totalMl}`);
    console.log(`[DELIVERY] Charges -> Weight: ₹${weightCharge}, Volume: ₹${volumeCharge}, TOTAL: ₹${totalDeliveryCharge}`);

    return res.json({ 
        deliveryCharge: totalDeliveryCharge, 
        method: 'zone_slab_mixed', 
        zone, 
        totalWeight: totalGrams,
        totalVolume: totalMl,
        breakdown: {
            weightCharge: Number(weightCharge),
            volumeCharge: Number(volumeCharge)
        }
    });

  } catch (error) {
    next(error);
  }
}

// --- ADMIN ENDPOINTS ---

async function getAdminDeliveryData(req, res, next) {
    try {
        // Get Tariffs
        const tariffs = await db.query('SELECT * FROM delivery_tariffs ORDER BY tariff_type, max_weight ASC');
        
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
        const { max_weight, prices, tariff_type } = req.body;
        if (!max_weight || !prices) return res.status(400).json({message: 'Missing fields'});
        
        const type = tariff_type || 'WEIGHT';

        const result = await db.query(
            'INSERT INTO delivery_tariffs (max_weight, prices, tariff_type) VALUES ($1, $2, $3) RETURNING *',
            [max_weight, JSON.stringify(prices), type]
        );
        res.status(201).json(result.rows[0]);
    } catch(e) { next(e); }
}

async function updateTariff(req, res, next) {
    try {
        const { id } = req.params;
        const { max_weight, prices, tariff_type } = req.body;
        
        const result = await db.query(
            'UPDATE delivery_tariffs SET max_weight = COALESCE($1, max_weight), prices = COALESCE($2, prices), tariff_type = COALESCE($3, tariff_type), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
            [max_weight, prices ? JSON.stringify(prices) : undefined, tariff_type, id]
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
async function getDeliveryCharges(req, res, next) {
    return getAdminDeliveryData(req, res, next); 
}

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
  getDeliveryCharges, 
  createDeliveryCharge,
  updateDeliveryCharge,
  deleteDeliveryCharge,
  saveDeliveryRule,
  deleteDeliveryRule
};
