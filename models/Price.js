const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for weight charges
const weightChargeSchema = new Schema({
    range: { type: String, required: true }, // e.g., '0-5', '6-10'
    charge: { type: Number, required: true }  // Cost for this weight range
}, { _id: false });

// Define the schema for delivery charges without enum
const deliveryChargeSchema = new Schema({
    type: { type: String, required: true }, // Manual entry for delivery types
    charge: { type: Number, required: true } // Cost for this delivery type
}, { _id: false });

// Define the schema for delivery scope charges without enum
const deliveryScopeChargeSchema = new Schema({
    scope: { type: String, required: true }, // Manual entry for delivery scopes
    charge: { type: Number, required: true } // Cost for this delivery scope
}, { _id: false });

// Define the schema for price categories without enum
const categorySchema = new Schema({
    name: { type: String, required: true }, // Manual entry for category names
    basePrice: { type: Number, required: true, min: 0 }, // Initial base price for the category
    weightCharges: [weightChargeSchema], // Array of weight charge ranges
    vatCharge : { type: Number, default: 0 }, // Additional insurance charge for this category
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
