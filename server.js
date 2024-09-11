const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const errorHandler = require('./utils/errorHandler');
const priceRoutes = require('./routes/priceRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const branchRoutes = require('./routes/branchRoutes');
const riderRoutes = require('./routes/riderRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use('/auth', authRoutes);
app.use('/prices', priceRoutes);
app.use('/customers', customerRoutes);
app.use('/shipments', shipmentRoutes);
app.use('/receipts', receiptRoutes);
app.use('/branch', branchRoutes);
app.use('/payroll', payrollRoutes);
app.use('/riders', riderRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
