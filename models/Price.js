const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for weight charges
const weightChargeSchema = new Schema({
    range: { type: String, required: true }, // e.g., '0-5', '6-10'
    charge: { type: Number, required: true }  // Cost for this weight range
}, { _id: false });

// Define the schema for delivery charges with enum
const deliveryChargeSchema = new Schema({
    type: {
        type: String,
        enum: ['hubToHub', 'officeToHub'], // Static delivery types
        required: true
    },
    charge: { type: Number, required: true } // Cost for this delivery type
}, { _id: false });

// Define the schema for delivery scope charges with enum
const deliveryScopeChargeSchema = new Schema({
    scope: {
        type: String,
        enum: ['withinState', 'interstate'], // Static delivery scopes
        required: true
    },
    charge: { type: Number, required: true } // Cost for this delivery scope
}, { _id: false });

// Define the schema for price categories with enum
const categorySchema = new Schema({
    name: {
        type: String,
        enum: ['Document', 'Parcel', 'Cargo'], // Static categories
        required: true
    },
    basePrice: { type: Number, required: true, min: 0 }, // Initial base price for the category
    weightCharges: [weightChargeSchema], // Array of weight charge ranges
    insuranceCharge: { type: Number, default: 0 }, // Additional insurance charge for this category
    deliveryCharges: [deliveryChargeSchema], // Array of delivery charges
    deliveryScopeCharges: [deliveryScopeChargeSchema] // Array of delivery scope charges
}, { _id: false });

// Define the main Price schema
const priceSchema = new Schema({
    categories: [categorySchema], // Array of categories with detailed pricing
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who created this price entry
        required: true
    }
}, { timestamps: true });

// Create a model based on the schema
const Price = mongoose.model('Price', priceSchema);

module.exports = Price;
