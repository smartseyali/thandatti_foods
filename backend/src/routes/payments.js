const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// Create payment order
router.post('/create-order', authenticate, paymentController.createPaymentOrder);

// Verify payment
router.post('/verify', authenticate, paymentController.verifyPayment);

// Webhook handlers (no authentication required, but signature verification is done)
router.post('/webhook/razorpay', paymentController.razorpayWebhook);
router.post('/webhook/phonepe', paymentController.phonepeWebhook);

module.exports = router;

