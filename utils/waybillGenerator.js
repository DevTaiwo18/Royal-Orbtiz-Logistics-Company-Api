const Shipment = require('../models/Shipment');

async function waybillGenerator(originState, destinationState) {
    const shipmentType = originState === destinationState ? 'WS' : 'IS';

    const today = new Date();
    const dateString = today.toISOString().slice(0, 10).replace(/-/g, ''); // Format: YYYYMMDD

    // Count the number of shipments created today with the same origin and destination
    const countToday = await Shipment.countDocuments({
        createdAt: {
            $gte: new Date(today.setHours(0, 0, 0, 0)),
            $lt: new Date(today.setHours(23, 59, 59, 999))
        },
        originState: originState,
        destinationState: destinationState
    });

    // Increment the count to get the next sequential number for today
    const sequentialNumber = countToday + 1;

    // Format the sequential number to be 4 digits, e.g., 0001
    const formattedSequentialNumber = sequentialNumber.toString().padStart(4, '0');

    // Generate the waybill number
    const waybillNumber = `${shipmentType}-${originState.substring(0, 3).toUpperCase()}-${dateString}-${formattedSequentialNumber}-${destinationState.substring(0, 3).toUpperCase()}`;

    // Return the unique waybill number
    return waybillNumber;
}

module.exports = waybillGenerator;
