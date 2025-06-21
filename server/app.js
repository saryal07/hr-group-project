const express = require('express');
const app = express();

app.use(express.json());

require('dotenv').config();
// config/db.js
const connectDB = require('./config/db');
connectDB();

// check api routing
const testRoutes = require('./routers/testRoutes');
app.use('/api', testRoutes);

const defaultRoute = require('./routers/testRoutes');
app.use('/api', defaultRoute);

const authRoutes = require('./routers/authRoutes');
app.use('/auth', authRoutes);

const employeeRoutes = require('./routers/employeeRoute');
app.use('/api/employee', employeeRoutes);

const hrRoutes = require('./routers/hrRoutes');
app.use('/api/hr', hrRoutes);

// handle incorrect links
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

app.use(notFound);
app.use(errorHandler);

module.exports = app;