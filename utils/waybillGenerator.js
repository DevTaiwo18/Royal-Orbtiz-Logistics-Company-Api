const Shipment = require('../models/Shipment');

async function waybillGenerator(originState, destinationState) {
    const shipmentType = originState === destinationState ? 'WS' : 'IS';

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const countToday = await Shipment.countDocuments({
        createdAt: { $gte: startOfToday, $lt: endOfToday }
    });

    const sequentialNumber = countToday + 1;

    const formattedSequentialNumber = sequentialNumber.toString().padStart(4, '0');

    const waybillNumber = `${shipmentType}-${originState.substring(0, 3).toUpperCase()}-${formattedSequentialNumber}-${destinationState.substring(0, 3).toUpperCase()}`;

    return waybillNumber;
}

module.exports = waybillGenerator;
