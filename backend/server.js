const express = require('express');
const cors = require('cors');
const config = require('./src/config/config');

const app = express();

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/categories', require('./src/routes/categories'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/cart', require('./src/routes/cart'));
app.use('/api/wishlist', require('./src/routes/wishlist'));
app.use('/api/compare', require('./src/routes/compare'));
app.use('/api/reviews', require('./src/routes/reviews'));
app.use('/api/blogs', require('./src/routes/blogs'));
app.use('/api/coupons', require('./src/routes/coupons'));
app.use('/api/addresses', require('./src/routes/addresses'));

// Error handling middleware
const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = config.server.port;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

