const Price = require('../models/Price');
const Shipment = require('../models/Shipment');

// Create a new price entry
exports.createPrice = async (req, res) => {
  try {
    const price = new Price(req.body);
    await price.save();
    res.status(201).json(price);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all price entries
exports.getAllPrices = async (req, res) => {
  try {
    const prices = await Price.find().populate('createdBy', 'name'); // Adjust the population as needed
    res.status(200).json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific price entry by ID
exports.getPriceById = async (req, res) => {
  try {
    const price = await Price.findById(req.params.id).populate('createdBy', 'name'); // Adjust the population as needed
    if (!price) {
      return res.status(404).json({ message: 'Price entry not found' });
    }
    res.status(200).json(price);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a price entry by ID
exports.updatePrice = async (req, res) => {
  try {
    const price = await Price.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!price) {
      return res.status(404).json({ message: 'Price entry not found' });
    }
    res.status(200).json(price);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a price entry by ID
exports.deletePrice = async (req, res) => {
  try {
    const price = await Price.findByIdAndDelete(req.params.id);
    if (!price) {
      return res.status(404).json({ message: 'Price entry not found' });
    }
    res.status(200).json({ message: 'Price entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate price based on shipment details
exports.calculatePrice = async (req, res) => {
  const {
    deliveryType, originState, destinationState, weight, categoryName, insurance
  } = req.body;

  try {
    // Find the price entry based on deliveryType, originState, and destinationState
    const priceEntry = await Price.findOne({
      'categories.name': categoryName
    });

    if (!priceEntry) {
      return res.status(404).json({ message: 'Price entry not found' });
    }

    // Find the category within the priceEntry
    const category = priceEntry.categories.find(cat => cat.name === categoryName);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Determine the weight charge
    const weightCharge = category.weightCharges.find(wc => {
      const [min, max] = wc.range.split('-').map(Number);
      return weight >= min && weight <= max;
    });
    const weightChargeAmount = weightCharge ? weightCharge.charge : 0;

    // Determine the delivery charges
    const deliveryCharge = category.deliveryCharges.find(dc => dc.type === deliveryType);
    const deliveryChargeAmount = deliveryCharge ? deliveryCharge.charge : 0;

    // Determine the delivery scope charge
    const deliveryScopeCharge = category.deliveryScopeCharges.find(ds => ds.scope === (originState === destinationState ? 'withinState' : 'interstate'));
    const deliveryScopeChargeAmount = deliveryScopeCharge ? deliveryScopeCharge.charge : 0;

    // Calculate total price
    const basePrice = category.basePrice;
    const insuranceCharge = insurance ? category.insuranceCharge : 0;
    const totalPrice = basePrice + weightChargeAmount + insuranceCharge + deliveryChargeAmount + deliveryScopeChargeAmount;

    res.status(200).json({ totalPrice });
  } catch (error) {
    res.status(500).json({ message: 'Price calculation failed', error: error.message });
  }
};
