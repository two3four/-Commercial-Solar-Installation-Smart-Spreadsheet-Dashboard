import * as XLSX from 'xlsx';

/**
 * Generates and downloads a professional XLSX file for a specific property using a template.
 * @param {Object} property - The property object containing all metrics.
 */
export const downloadPropertyXLSX = async (property) => {
    try {
        // 1. Fetch the template file from the public directory
        const response = await fetch('/templates/template.xlsx');
        const arrayBuffer = await response.arrayBuffer();

        // 2. Read the workbook
        const wb = XLSX.read(arrayBuffer, { type: 'array' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];

        // 3. Precise Cell Mapping based on user template
        // Property Information
        ws['B4'] = { v: property.address };
        ws['B5'] = { v: property.zip };
        ws['B6'] = { v: property.email };
        ws['B7'] = { v: property.phone };

        // Technical Specifications
        ws['B10'] = { v: property.roofArea };
        ws['B11'] = { v: property.usableArea };
        ws['B12'] = { v: "20 Watts / sq ft" };

        // Solar Capacity Estimates
        ws['B15'] = { v: property.capacityWatts };
        ws['B16'] = { v: parseFloat(property.capacityKW.toFixed(2)) };
        ws['B17'] = { v: parseFloat(property.capacityMW.toFixed(4)) };
        ws['B18'] = { v: "Qualified (Commercial)" };

        // 4. Trigger Download
        XLSX.writeFile(wb, `Solar_Harvest_Report_${property.address.replace(/\s+/g, '_')}.xlsx`);
    } catch (error) {
        console.error("Error generating XLSX from template:", error);
        alert("Failed to generate report using template. Please try again.");
    }
};

export const downloadPropertyCSV = downloadPropertyXLSX;
