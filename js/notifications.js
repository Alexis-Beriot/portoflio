/**
 * User Notification System
 * 
 * This module provides user-facing notification messages:
 * - Error messages
 * - Success messages
 * - Info messages
 * 
 * @author Alexis BERIOT
 * @version 2.0.0
 * @license MIT
 */
'use strict';

// Track message timeouts to avoid hiding newer messages
const messageTimers = {
    error: null,
    success: null,
    info: null
};

/**
 * Generic function to display a message to the user
 * @param {string} type - Type of message ('error', 'success', 'info')
 * @param {string} message - Message text to display
 * @param {number} duration - Duration in milliseconds (default: 5000)
 * @returns {void}
 * @private
 */
function showMessage(type, message, duration = 5000) {
    const messageId = `${type}-message`;
    let messageDiv = document.getElementById(messageId);
    
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = messageId;
        messageDiv.className = `${type}-message`;
        messageDiv.setAttribute('role', 'alert');
        messageDiv.setAttribute('aria-live', 'polite');
        
        if (document.body) {
            document.body.insertBefore(messageDiv, document.body.firstChild);
        } else {
            // If body not ready, wait for DOM then show the message
            document.addEventListener('DOMContentLoaded', () => {
                if (!document.getElementById(messageId) && document.body) {
                    document.body.insertBefore(messageDiv, document.body.firstChild);
                    messageDiv.textContent = message;
                    messageDiv.style.display = 'block';
                    
                    // Set timer to hide the message
                    messageTimers[type] = setTimeout(() => {
                        messageDiv.style.display = 'none';
                    }, duration);
                }
            }, { once: true });
            return; // Exit early - message will be shown when DOM ready
        }
    }
    
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    // Clear existing timer for this message type
    if (messageTimers[type]) {
        clearTimeout(messageTimers[type]);
    }
    
    // Set new timer to hide the message
    messageTimers[type] = setTimeout(() => {
        messageDiv.style.display = 'none';
    }, duration);
}

/**
 * Shows an error message to the user
 * @param {string} message - Error message
 * @returns {void}
 */
export function showError(message) {
    showMessage('error', message);
}

/**
 * Shows a success message to the user
 * @param {string} message - Success message
 * @returns {void}
 */
export function showSuccess(message) {
    showMessage('success', message);
}

/**
 * Shows an info message to the user
 * @param {string} message - Info message
 * @returns {void}
 */
export function showInfo(message) {
    showMessage('info', message);
}
