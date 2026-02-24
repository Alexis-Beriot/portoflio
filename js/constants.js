/**
 * Constants for Portfolio Application
 * 
 * This module defines all constants used across the portfolio application
 * including project states, types, and language settings.
 * 
 * @author Alexis BERIOT
 * @version 2.0.0
 * @license MIT
 */
'use strict';

// Constants for project states
export const PROJECT_STATE = {
    LARGE: 1,
    SMALL: 0
};

export const PROJECT_TYPE = {
    PERSONAL: 1,
    SCHOOL: 0
};

export const LANGUAGE = {
    ENGLISH: 1,
    FRENCH: 0
};

// Module-level counter for unique project IDs
export let projectCounter = 0;

/**
 * Increments and returns the project counter
 * @returns {number} The new counter value
 */
export function incrementProjectCounter() {
    return ++projectCounter;
}
