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

        // 3. Populate metrics into the template (Mapping to the structure seen in the user's screenshot)
        // Based on the screenshot, it looks like a flat header-row structure starting at row 1
        // We will append a new row with the property data to maintain the template formatting

        const rowData = [
            property.address,
            property.zip,
            property.roofArea,
            property.usableArea,
            "80%",
            property.capacityWatts,
            property.capacityKW.toFixed(2),
            property.capacityMW.toFixed(4),
            "20",
            property.email,
            property.phone,
            property.timestamp
        ];

        // Append to row 2
        XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: "A2" });

        // 4. Trigger Download
        XLSX.writeFile(wb, `Solar_Harvest_Report_${property.address.replace(/\s+/g, '_')}.xlsx`);
    } catch (error) {
        console.error("Error generating XLSX from template:", error);
        alert("Failed to generate report using template. Please try again.");
    }
};

export const downloadPropertyCSV = downloadPropertyXLSX;
