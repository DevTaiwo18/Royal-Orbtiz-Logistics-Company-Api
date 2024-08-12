const Shipment = require('../models/Shipment');

async function waybillGenerator(originState, destinationState) {
    const shipmentType = originState === destinationState ? 'WS' : 'IS';

    const today = new Date();
    const dateString = today.toISOString().slice(0, 10).replace(/-/g, ''); // Format: YYYYMMDD

    const countToday = await Shipment.countDocuments({
        createdAt: {
            $gte: new Date(today.setHours(0, 0, 0, 0)),
            $lt: new Date(today.setHours(23, 59, 59, 999))
        }
    });

    const sequentialNumber = countToday + 1;

    const formattedSequentialNumber = sequentialNumber.toString().padStart(4, '0');

    const waybillNumber = `${shipmentType}-${originState.substring(0, 3).toUpperCase()}-${dateString}-${formattedSequentialNumber}-${destinationState.substring(0, 3).toUpperCase()}`;

    return waybillNumber;
}

module.exports = waybillGenerator;
