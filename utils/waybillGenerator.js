const Shipment = require('../models/Shipment');

async function waybillGenerator(originState, destinationState, BranchName) {
    const shipmentType = originState === destinationState ? 'WS' : 'IS';

    // Count the total number of shipments the company has run
    const totalShipments = await Shipment.countDocuments();

    // Increment the total shipment count to get the next sequential number
    const sequentialNumber = totalShipments + 1;

    // Format the sequential number to be 4 digits, e.g., 0001
    const formattedSequentialNumber = sequentialNumber.toString().padStart(4, '0');

    // Generate the waybill number including BranchName
    const waybillNumber = `${shipmentType}-${originState.substring(0, 3).toUpperCase()}-${formattedSequentialNumber}-${destinationState.substring(0, 3).toUpperCase()}-${BranchName.substring(0, 3).toUpperCase()}`;

    // Return the unique waybill number
    return waybillNumber;
}

module.exports = waybillGenerator;
