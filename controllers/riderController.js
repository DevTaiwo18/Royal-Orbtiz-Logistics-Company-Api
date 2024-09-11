const Rider = require('../models/Rider');

// CREATE a new rider
exports.createRider = async (req, res) => {
    try {
        const { riderName, contactNumber, email, vehicleType, vehicleModel, vehiclePlateNumber, vehicleStatus } = req.body;

        // Create a new rider
        const newRider = new Rider({
            riderName,
            contactNumber,
            email,
            vehicleType,
            vehicleModel,
            vehiclePlateNumber,
            vehicleStatus,
        });

        // Save the rider to the database
        const savedRider = await newRider.save();
        res.status(201).json({ rider: savedRider });
    } catch (error) {
        console.error('Error creating rider:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET all riders
exports.getAllRiders = async (req, res) => {
    try {
        const riders = await Rider.find().sort({ createdAt: -1 }); // Sort by creation date
        res.status(200).json(riders);
    } catch (error) {
        console.error('Error fetching riders:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET a rider by ID
exports.getRiderById = async (req, res) => {
    const riderId = req.params.id;

    try {
        const rider = await Rider.findById(riderId);
        if (!rider) {
            return res.status(404).json({ message: `Rider with ID ${riderId} not found` });
        }
        res.status(200).json(rider);
    } catch (error) {
        console.error('Error fetching rider:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// UPDATE a rider by ID
exports.updateRider = async (req, res) => {
    const riderId = req.params.id;
    const { riderName, contactNumber, email, vehicleType, vehicleModel, vehiclePlateNumber, vehicleStatus } = req.body;

    try {
        const updateFields = {
            riderName,
            contactNumber,
            email,
            vehicleType,
            vehicleModel,
            vehiclePlateNumber,
            vehicleStatus,
        };

        const updatedRider = await Rider.findByIdAndUpdate(riderId, updateFields, { new: true });

        if (!updatedRider) {
            return res.status(404).json({ message: `Rider with ID ${riderId} not found` });
        }

        res.status(200).json(updatedRider);
    } catch (error) {
        console.error('Error updating rider:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE a rider by ID
exports.deleteRider = async (req, res) => {
    const riderId = req.params.id;

    try {
        const deletedRider = await Rider.findByIdAndDelete(riderId);
        if (!deletedRider) {
            return res.status(404).json({ message: `Rider with ID ${riderId} not found` });
        }
        res.status(200).json({ message: 'Rider deleted successfully' });
    } catch (error) {
        console.error('Error deleting rider:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
