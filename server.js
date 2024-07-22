const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const receiptRoutes = require('./routes/receiptRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use('/auth', authRoutes);
app.use('/customers', customerRoutes);
app.use('/shipments', shipmentRoutes);
app.use('/receipt', receiptRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
