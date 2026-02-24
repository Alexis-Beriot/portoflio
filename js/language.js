/**
 * Language Switching Module
 * 
 * This module handles language switching functionality:
 * - Switching between English and French versions
 * - URL manipulation for language variants
 * - Path normalization
 * 
 * @author Alexis BERIOT
 * @version 2.0.0
 * @license MIT
 */
'use strict';

import { LANGUAGE } from './constants.js';

/**
 * Switches between English and French language versions
 * @param {number} lang - LANGUAGE.ENGLISH (1) or LANGUAGE.FRENCH (0)
 * @returns {void}
 */
export function switchLanguage(lang) {
    // Validate language parameter
    if (lang !== LANGUAGE.ENGLISH && lang !== LANGUAGE.FRENCH) {
        console.error('Invalid language parameter. Use LANGUAGE.ENGLISH or LANGUAGE.FRENCH');
        return;
    }
    
    const url = new URL(window.location.href);
    const currentPath = url.pathname;
    let newPath;
    let normalizedPath = currentPath;

    // Normalize non-html routes to a concrete page (default to index.html)
    if (!/\.html$/i.test(normalizedPath)) {
        if (!normalizedPath.endsWith('/')) {
            normalizedPath += '/';
        }
        normalizedPath += 'index.html';
    }
    
    if (lang === LANGUAGE.ENGLISH) {
        // Switch to English - remove "-fr" before ".html"
        newPath = normalizedPath.replace(/-fr(\.html)$/i, '$1');
    } else {
        // Switch to French - add "-fr" before ".html"
        // Check if already ends with "-fr.html" to avoid duplicate "-fr-fr"
        if (!/-fr\.html$/i.test(normalizedPath)) {
            // Use safe replace targeting only the extension
            newPath = normalizedPath.replace(/(\.html)$/i, '-fr$1');
        } else {
            newPath = normalizedPath;
        }
    }
    
    // Only navigate if path changed; preserve search and hash
    if (newPath !== currentPath) {
        url.pathname = newPath;
        window.location.href = url.toString();
    }
}
