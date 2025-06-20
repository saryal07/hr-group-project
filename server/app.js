const express = require('express');
const app = express();

require('dotenv').config();
// config/db.js
const connectDB = require('./config/db');
connectDB();

// check api routing
const testRoutes = require('./routers/testRoutes');
app.use('/api', testRoutes);

const defaultRoute = require('./routers/testRoutes');
app.use('/api', defaultRoute);

// handle incorrect links
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

app.use(notFound);
app.use(errorHandler);

module.exports = app;