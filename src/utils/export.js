/**
 * Generates and downloads a CSV file for a specific property.
 * @param {Object} property - The property object containing all metrics.
 */
export const downloadPropertyCSV = (property) => {
    const headers = [
        "Property Address",
        "Zip Code",
        "Total Roof Area (sq ft)",
        "Usable Roof Area (sq ft)",
        "Usable Percentage",
        "Solar Capacity (Watts)",
        "Solar Capacity (kW)",
        "Solar Capacity (MW)",
        "Power Density (W/sq ft)",
        "Owner Email",
        "Phone Number",
        "Timestamp"
    ];

    const data = [
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

    const csvContent = [
        headers.join(","),
        data.map(val => `"${val}"`).join(",")
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", `Solar_Report_${property.address.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
