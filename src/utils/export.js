import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * Generates and downloads a XLSX file by populating a provided template.
 * @param {Object} property - The property object containing all metrics.
 */
export const downloadPropertyXLSX = async (property) => {
    try {
        // 1. Fetch the template file
        const response = await fetch('/template.xlsx');
        const arrayBuffer = await response.arrayBuffer();

        // 2. Load the workbook
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        const worksheet = workbook.getWorksheet(1); // Get the first sheet

        // 3. Populate Data into specific cells (B4-B18)
        // Property Information
        worksheet.getCell('B4').value = property.address;
        worksheet.getCell('B5').value = property.zip;
        worksheet.getCell('B6').value = property.email;
        worksheet.getCell('B7').value = property.phone;

        // Technical Specifications
        worksheet.getCell('B10').value = property.roofArea;
        worksheet.getCell('B11').value = property.usableArea;
        worksheet.getCell('B12').value = "20 Watts / sq ft";

        // Solar Capacity Estimates
        worksheet.getCell('B15').value = property.capacityWatts;
        worksheet.getCell('B16').value = parseFloat(property.capacityKW.toFixed(2));
        worksheet.getCell('B17').value = parseFloat(property.capacityMW.toFixed(4));
        worksheet.getCell('B18').value = "Qualified (Commercial)";

        // 4. Generate and Save
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Solar_Harvest_Report_${property.address.replace(/\s+/g, '_')}.xlsx`);
    } catch (error) {
        console.error("Error generating XLSX from template:", error);
        alert("Could not generate the report. Make sure the template file exists in the public folder.");
    }
};

export const downloadPropertyCSV = downloadPropertyXLSX;
