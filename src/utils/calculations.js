import { PROJECT_RULES } from '../constants';

/**
 * Calculates usable roof area based on total roof area.
 * @param {number} totalArea - Total roof area in sq ft.
 * @returns {number} Usable area in sq ft.
 */
export const calculateUsableArea = (totalArea) => {
    return totalArea * PROJECT_RULES.USABLE_AREA_PERCENTAGE;
};

/**
 * Calculates total installable solar capacity in Watts.
 * @param {number} usableArea - Usable roof area in sq ft.
 * @returns {number} Total capacity in Watts.
 */
export const calculateSolarCapacityWatts = (usableArea) => {
    return usableArea * PROJECT_RULES.POWER_DENSITY_W_PER_SQFT;
};

/**
 * Converts Watts to Kilowatts.
 * @param {number} watts 
 * @returns {number}
 */
export const toKW = (watts) => watts / 1000;

/**
 * Converts Watts to Megawatts.
 * @param {number} watts 
 * @returns {number}
 */
export const toMW = (watts) => watts / 1000000;

/**
 * Validates roof size against project rules.
 * @param {number} size 
 * @returns {boolean}
 */
export const isValidRoofSize = (size) => {
    return size >= PROJECT_RULES.MIN_ROOF_SIZE && size <= PROJECT_RULES.MAX_ROOF_SIZE;
};
