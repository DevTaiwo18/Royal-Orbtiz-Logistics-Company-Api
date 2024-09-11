const mongoose = require('mongoose');

const RiderSchema = new mongoose.Schema({
    riderName: {
        type: String,
        required: true,
        trim: true,
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true,
    },
    vehicleType: {
        type: String,
        required: true,
        enum: ['Bike', 'Motorcycle', 'Van', 'Truck', 'Other'], // Enum for predefined vehicle types
    },
    vehicleModel: {
        type: String,
        required: true,
        trim: true,
    },
    vehiclePlateNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    vehicleStatus: {
        type: String,
        enum: ['Active', 'In Maintenance', 'Inactive'],
        default: 'Active',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

RiderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Rider', RiderSchema);
