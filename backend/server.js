import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Load routes
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import oemRoutes from './routes/oemRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';
import connectDB from './config/db.js';

// Setup environment config
dotenv.config();

const app = express();
// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Resolve paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import mock fallback data
import { seedProducts, seedUsers } from './config/mockData.js';

// Middleware to check database connection status & provide offline fallback
app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  console.log(`[Offline Mode] Intercepting ${req.method} ${req.path}`);

  // Fallback for Products Listing
  if (req.method === 'GET' && req.path === '/products') {
    const category = req.query.category;
    const search = req.query.search;
    let products = [...seedProducts];
    if (category) {
      products = products.filter(p => p.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    return res.json(products);
  }

  // Fallback for Single Product Details
  if (req.method === 'GET' && req.path.startsWith('/products/')) {
    const productId = req.path.split('/')[2];
    const product = seedProducts.find(p => p._id === productId || p.sku === productId);
    if (product) {
      return res.json(product);
    }
    return res.status(404).json({ message: 'Product not found (Offline Mode)' });
  }

  // Fallback for User Login
  if (req.method === 'POST' && req.path === '/users/login') {
    const { email, password } = req.body;
    const matchedUser = seedUsers.find(u => u.email === email && u.password === password);
    if (matchedUser) {
      const userRes = { ...matchedUser };
      delete userRes.password;
      userRes.token = 'mock-jwt-token-for-offline-mode';
      return res.json(userRes);
    }
    return res.status(401).json({ message: 'Invalid email or password (Offline Mode)' });
  }

  // Fallback for B2B / B2C User Registration
  if (req.method === 'POST' && (req.path === '/users/register/b2c' || req.path === '/users/register/b2b')) {
    const { name, email } = req.body || {};
    return res.status(201).json({
      _id: 'mock-offline-user-id-' + Date.now(),
      name: name || 'Mock User',
      email: email || 'mock@example.com',
      role: req.path.includes('b2b') ? 'b2b' : 'b2c',
      token: 'mock-jwt-token-for-offline-mode',
      b2bProfile: req.path.includes('b2b') ? {
        companyName: req.body.companyName || 'Mock Company',
        gstinOrTaxId: req.body.gstinOrTaxId || '29MOCK00000X1Z0',
        verificationStatus: 'approved'
      } : undefined
    });
  }

  // Fallback for OEM Inquiry Submission
  if (req.method === 'POST' && req.path === '/oem/inquiry') {
    return res.status(201).json({
      message: 'OEM Inquiry submitted successfully (Offline Sandbox Mode)',
      inquiry: {
        _id: 'mock-inquiry-' + Date.now(),
        ...req.body
      }
    });
  }

  // Fallback for Order Submission
  if (req.method === 'POST' && req.path === '/orders') {
    return res.status(201).json({
      message: 'Order created successfully (Offline Sandbox Mode)',
      order: {
        _id: 'mock-order-' + Date.now(),
        orderItems: req.body.orderItems || [],
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        taxPrice: req.body.taxPrice,
        shippingPrice: req.body.shippingPrice,
        totalPrice: req.body.totalPrice,
        isPaid: false,
        isDelivered: false
      }
    });
  }

  if (req.method === 'POST' && req.path === '/assistant/chat') {
    return next();
  }

  next();
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/oem', oemRoutes);
app.use('/api/assistant', assistantRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Bapuji Surgicals Backend API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
