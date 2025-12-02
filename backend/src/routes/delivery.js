const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { optionalAuth, authenticate, requireRole } = require('../middleware/auth');

// Public route to calculate delivery charge
router.post('/calculate', optionalAuth, deliveryController.calculateDeliveryCharge);

// Admin route to get all configurations
router.get('/charges', authenticate, requireRole('admin'), deliveryController.getDeliveryCharges);

module.exports = router;
