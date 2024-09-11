const Shipment = require('../models/Shipment');

async function waybillGenerator(originState, destinationState, BranchName) {
    const shipmentType = originState === destinationState ? 'WS' : 'IS';

    // Get current date in YYYYMMDD format for traceability
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    // Generate the waybill number including BranchName and date, but without sequential number
    const waybillNumber = `${shipmentType}-${originState.substring(0, 3).toUpperCase()}-${destinationState.substring(0, 3).toUpperCase()}-${BranchName.substring(0, 3).toUpperCase()}-${currentDate}`;

    // Return the unique waybill number
    return waybillNumber;
}

module.exports = waybillGenerator;
