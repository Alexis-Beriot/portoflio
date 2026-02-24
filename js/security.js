/**
 * Security and Sanitization Functions
 * 
 * This module provides security-related utilities including:
 * - HTML escaping to prevent XSS attacks
 * - Skill key normalization for safe data attributes
 * - CSS value escaping for safe selectors
 * 
 * @author Alexis BERIOT
 * @version 2.0.0
 * @license MIT
 */
'use strict';

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML
 */
export function escapeHtml(text) {
    const safeText = String(text ?? '');
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return safeText.replace(/[&<>"']/g, char => map[char]);
}

/**
 * Normalizes skill strings for safe data attribute usage and lookups
 * @param {string} skill - Skill text to normalize
 * @returns {string} Normalized value safe for HTML attributes
 */
export function normalizeSkillKey(skill) {
    return encodeURIComponent(String(skill));
}

/**
 * Safely escapes CSS attribute values with a fallback for older browsers
 * @param {string} value - Value to escape
 * @returns {string} Escaped value for CSS selectors
 */
export function safeCssEscape(value) {
    const stringValue = String(value ?? '');
    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
        return CSS.escape(stringValue);
    }
    // Fallback: escape special CSS characters
    return stringValue.replace(/([!"#$%&'()*+,./:;<=>?@\[\\\]^`{|}~])/g, '\\$1');
}
