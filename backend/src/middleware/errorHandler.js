const config = require('../config/config');

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Validation errors
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({
      message: err.message || 'Validation error',
      errors: err.errors,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired',
    });
  }

  // Database errors
  if (err.code === '23505') { // Unique violation
    return res.status(409).json({
      message: 'Duplicate entry',
    });
  }

  if (err.code === '23503') { // Foreign key violation
    return res.status(400).json({
      message: 'Invalid reference',
    });
  }

  // Default error
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    message,
    ...(config.server.env === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;

