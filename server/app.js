require('dotenv').config();
const express = require('express');
const app = express();

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Database connection
const connectDB = require('./config/db');
connectDB();

// Route configurations
const testRoutes = require('./routers/testRoutes');
app.use('/api', testRoutes);

const authRoutes = require('./routers/authRoutes');
app.use('/api/auth', authRoutes);

const employeeRoutes = require('./routers/employeeRoute');
app.use('/api/employee', employeeRoutes);

const hrRoutes = require('./routers/hrRoutes');
app.use('/api/hr', hrRoutes);

const documentRoutes = require('./routers/documentRoutes');
app.use('/api/documents', documentRoutes);

// Error handling middleware
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

app.use(notFound);
app.use(errorHandler);

module.exports = app;