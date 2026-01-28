import * as XLSX from 'xlsx';

/**
 * Generates and downloads a professional XLSX file for a specific property.
 * @param {Object} property - The property object containing all metrics.
 */
export const downloadPropertyXLSX = (property) => {
    // 1. Prepare Data with clear, branded headers
    const data = [
        ["SOLAR HARVEST - PROPERTY INSTALLATION REPORT"],
        ["Generated on: " + new Date().toLocaleString()],
        [], // Spacer
        ["PROPERTY INFORMATION", ""],
        ["Address", property.address],
        ["Zip Code", property.zip],
        ["Management Email", property.email],
        ["Contact Phone", property.phone],
        [], // Spacer
        ["TECHNICAL SPECIFICATIONS", ""],
        ["Total Roof Area", property.roofArea.toLocaleString() + " sq ft"],
        ["Usable Roof Area (80%)", property.usableArea.toLocaleString() + " sq ft"],
        ["Power Density", "20 Watts / sq ft"],
        [], // Spacer
        ["SOLAR CAPACITY ESTIMATES", ""],
        ["Total Watts", property.capacityWatts.toLocaleString() + " W"],
        ["Total Kilowatts", property.capacityKW.toFixed(2) + " kW"],
        ["Total Megawatts", property.capacityMW.toFixed(4) + " MW"],
        ["Project Status", "Qualified (Commercial)"]
    ];

    // 2. Create Workbook and Worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Property Report");

    // 3. Set Column Widths for readability
    ws['!cols'] = [
        { wch: 25 }, // Column A
        { wch: 40 }, // Column B
    ];

    // 4. Trigger Download
    XLSX.writeFile(wb, `Solar_Harvest_Report_${property.address.replace(/\s+/g, '_')}.xlsx`);
};

// Also keep the old one for compatibility or rename if needed
export const downloadPropertyCSV = downloadPropertyXLSX; 
