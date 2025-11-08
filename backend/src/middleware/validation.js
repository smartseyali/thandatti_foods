const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array(),
    });
  }
  next();
};

// Auth validation
const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  handleValidationErrors,
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  handleValidationErrors,
];

// Product validation
const validateProduct = [
  body('title').notEmpty().trim(),
  body('sku').notEmpty().trim(),
  body('newPrice').isFloat({ min: 0 }),
  body('primaryImage').notEmpty(),
  handleValidationErrors,
];

// Order validation
const validateOrder = [
  body('shippingAddressId').isUUID(),
  body('items').isArray({ min: 1 }),
  body('items.*.productId').isUUID(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('items.*.price').isFloat({ min: 0 }),
  handleValidationErrors,
];

// Review validation
const validateReview = [
  body('productId').isUUID(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').notEmpty().trim(),
  handleValidationErrors,
];

// Address validation
const validateAddress = [
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('addressLine').notEmpty().trim(),
  body('city').notEmpty().trim(),
  body('postalCode').notEmpty().trim(),
  body('country').notEmpty().trim(),
  handleValidationErrors,
];

// UUID param validation
const validateUUID = [
  param('id').isUUID(),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateProduct,
  validateOrder,
  validateReview,
  validateAddress,
  validateUUID,
};

