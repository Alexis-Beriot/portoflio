/**
 * Main Portfolio Application Entry Point
 * 
 * This module initializes the portfolio application and provides
 * a unified interface to all portfolio functionality.
 * 
 * @author Alexis BERIOT
 * @version 2.0.0
 * @license MIT
 */
'use strict';

// Import constants
import { PROJECT_STATE, PROJECT_TYPE, LANGUAGE } from './constants.js';

// Import security functions
import { escapeHtml, normalizeSkillKey, safeCssEscape } from './security.js';

// Import validation functions
import { isValidEmail, isValidPhoneNumber, validateContactForm } from './validation.js';

// Import notification functions
import { showError, showSuccess, showInfo } from './notifications.js';

// Import email functions
import { sendEmail, resetContactForm } from './email.js';

// Import project functions
import { toggleProjectBox, developProject, highlightSkill, attachHighlightListeners } from './projects.js';

// Import language functions
import { switchLanguage } from './language.js';

// Track initialization to prevent duplicate event listeners
let isInitialized = false;

/**
 * Initializes project box toggle functionality
 * Delegates click events to avoid inline handlers (CSP-friendly)
 * @returns {void}
 */
function initProjectToggle() {
    // Prevent duplicate initialization
    if (isInitialized) {
        console.warn('Project toggle already initialized');
        return;
    }
    
    document.addEventListener('click', event => {
        const projectElement = event.target.closest('.project-box[data-toggle="project"]');
        if (projectElement) {
            event.preventDefault();
            toggleProjectBox(projectElement);
        }
    });
    
    isInitialized = true;
}

/**
 * Initializes the portfolio application
 * Should be called when DOM is ready
 * @returns {void}
 */
function init() {
    initProjectToggle();
}

// Wait for DOM to be ready before attaching event listeners
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export all public APIs for use in HTML or other scripts
export {
    // Constants
    PROJECT_STATE,
    PROJECT_TYPE,
    LANGUAGE,
    
    // Security functions
    escapeHtml,
    normalizeSkillKey,
    safeCssEscape,
    
    // Validation functions
    isValidEmail,
    isValidPhoneNumber,
    validateContactForm,
    
    // Notification functions
    showError,
    showSuccess,
    showInfo,
    
    // Email functions
    sendEmail,
    resetContactForm,
    
    // Project functions
    toggleProjectBox,
    developProject,
    highlightSkill,
    attachHighlightListeners,
    
    // Language functions
    switchLanguage,
    
    // Initialization
    init
};
