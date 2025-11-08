const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, requireRole } = require('../middleware/auth');
const { validateOrder, validateUUID } = require('../middleware/validation');

router.get('/', authenticate, orderController.getUserOrders);
router.get('/:id', authenticate, validateUUID, orderController.getOrderById);
router.post('/', authenticate, validateOrder, orderController.createOrder);
router.put('/:id/status', authenticate, requireRole('admin'), validateUUID, orderController.updateOrderStatus);

module.exports = router;

