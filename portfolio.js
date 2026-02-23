/**
 * Portfolio Functions for Alexis BERIOT
 * 
 * This module provides core functionality for the portfolio website including:
 * - Project box creation and management
 * - Contact form validation and email sending
 * - Language switching (English/French)
 * - Skill highlighting
 * - User notification messages
 * 
 * @author Alexis BERIOT
 * @version 2.0.0
 * @license MIT
 */
'use strict';

// Constants for project states
const PROJECT_STATE = {
    LARGE: 1,
    SMALL: 0
};

const PROJECT_TYPE = {
    PERSONAL: 1,
    SCHOOL: 0
};

const LANGUAGE = {
    ENGLISH: 1,
    FRENCH: 0
};

// Module-level counter for unique project IDs
let projectCounter = 0;

// Track message timeouts to avoid hiding newer messages
const messageTimers = {
    error: null,
    success: null,
    info: null
};

// Track initialization to prevent duplicate event listeners
let isInitialized = false;

// Track EmailJS initialization separately (don't modify third-party objects)
let emailJsInitialized = false;

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML
 */
function escapeHtml(text) {
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
function normalizeSkillKey(skill) {
    return encodeURIComponent(String(skill));
}

/**
 * Toggles a project box between expanded and collapsed states
 * Changes the state from 1 (large) to 0 (small) or vice versa
 * @param {HTMLElement} projectElement - The project element to toggle
 * @returns {void}
 */
function toggleProjectBox(projectElement) {
    if (!projectElement) return;
    
    const isExpanded = projectElement.dataset.expanded === '1';
    projectElement.dataset.expanded = isExpanded ? '0' : '1';
    
    // Use classList.toggle for cleaner code
    projectElement.classList.toggle('project-large', !isExpanded);
    projectElement.classList.toggle('project-small', isExpanded);
}

/**
 * Develops a project box with the specified parameters
 * @param {number} big - PROJECT_STATE.LARGE (1) for large box (longInfo), PROJECT_STATE.SMALL (0) for small box (shortInfo)
 * @param {number} type - PROJECT_TYPE.PERSONAL (1) for personal projects, PROJECT_TYPE.SCHOOL (0) for school
 * @param {string} category - Project category/school name
 * @param {string} shortInfo - Short description
 * @param {string} longInfo - Long/detailed description
 * @param {string[]} skillList - Array of skills used in the project
 * @returns {string} HTML string for the project box
 */
function developProject(big, type, category, shortInfo, longInfo, skillList = []) {
    // Validate required parameters
    if (big !== PROJECT_STATE.LARGE && big !== PROJECT_STATE.SMALL) {
        console.error('Invalid size parameter. Use PROJECT_STATE.LARGE or PROJECT_STATE.SMALL');
        return '';
    }
    
    if (type !== PROJECT_TYPE.PERSONAL && type !== PROJECT_TYPE.SCHOOL) {
        console.error('Invalid type parameter. Use PROJECT_TYPE.PERSONAL or PROJECT_TYPE.SCHOOL');
        return '';
    }
    
    if (!category || typeof category !== 'string') {
        console.error('Category is required and must be a string');
        return '';
    }
    
    if (!shortInfo || typeof shortInfo !== 'string') {
        console.error('Short info is required and must be a string');
        return '';
    }
    
    if (!longInfo || typeof longInfo !== 'string') {
        console.error('Long info is required and must be a string');
        return '';
    }
    
    if (!Array.isArray(skillList)) {
        console.error('Skill list must be an array');
        return '';
    }
    
    // Use crypto.randomUUID() if available, fallback to timestamp-based ID
    let uniqueId;
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        uniqueId = crypto.randomUUID();
    } else {
        projectCounter++;
        uniqueId = `${Date.now()}-${projectCounter}`;
    }
    const projectId = `project-${uniqueId}`;
    const sizeClass = big === PROJECT_STATE.LARGE ? 'project-large' : 'project-small';
    const content = big === PROJECT_STATE.LARGE ? longInfo : shortInfo;
    const typeLabel = type === PROJECT_TYPE.PERSONAL ? 'Personal Project' : 'School Project';
    
    // Escape all user-controlled values to prevent XSS
    const escapedCategory = escapeHtml(category);
    const escapedContent = escapeHtml(content);
    
    let skillsHtml = '';
    if (skillList.length > 0) {
        skillsHtml = '<div class="skills-container">' + 
            skillList.map(skill => {
                const safeText = escapeHtml(String(skill));
                const skillKey = normalizeSkillKey(skill);
                return `<span class="skill-tag" data-skill="${skillKey}">${safeText}</span>`;
            }).join('') + 
            '</div>';
    }
    
    const html = `
        <div id="${projectId}" class="project-box ${sizeClass}" data-expanded="${big}" data-toggle="project">
            <div class="project-header">
                <h3 class="project-title">${escapedCategory}</h3>
                <span class="project-type">${typeLabel}</span>
            </div>
            <div class="project-content">
                ${escapedContent}
            </div>
            ${skillsHtml}
        </div>
    `;
    
    return html;
}

/**
 * Safely escapes CSS attribute values with a fallback for older browsers
 * @param {string} value - Value to escape
 * @returns {string} Escaped value for CSS selectors
 */
function safeCssEscape(value) {
    const stringValue = String(value ?? '');
    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
        return CSS.escape(stringValue);
    }
    // Fallback: escape special CSS characters
    return stringValue.replace(/([!"#$%&'()*+,./:;<=>?@\[\\\]^`{|}~])/g, '\\$1');
}

/**
 * Switches between English and French language versions
 * @param {number} lang - LANGUAGE.ENGLISH (1) or LANGUAGE.FRENCH (0)
 * @returns {void}
 */
function switchLanguage(lang) {
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

/**
 * Validates the contact form with multiple checks
 * @param {string} name - Contact name
 * @param {string} email - Contact email (optional)
 * @param {string} phoneNumber - Contact phone (optional)
 * @param {string} company - Company name
 * @param {string} comment - Message content
 * @returns {{success: boolean, name: string, email: string, phoneNumber: string, company: string, finalComment: string}|false} Validation result object on success, false otherwise
 */
function validateContactForm(name, email, phoneNumber, company, comment) {
    // Check name
    if (!name || name.trim() === '') {
        showError('Name is required');
        return false;
    }
    
    // Check company
    if (!company || company.trim() === '') {
        showError('Company is required');
        return false;
    }
    
    // Check if either email or phone is provided
    if ((!email || email.trim() === '') && (!phoneNumber || phoneNumber.trim() === '')) {
        showError('Please provide either an email or phone number');
        return false;
    }
    
    // Validate email if provided
    if (email && email.trim() !== '') {
        if (!isValidEmail(email)) {
            showError('Please provide a valid email address');
            return false;
        }
    }
    
    // Validate phone number if provided
    if (phoneNumber && phoneNumber.trim() !== '') {
        if (!isValidPhoneNumber(phoneNumber)) {
            showError('Please provide a valid phone number (French +33 or international format)');
            return false;
        }
    }
    
    // Set default comment if empty
    const finalComment = (comment && comment.trim() !== '') 
        ? comment 
        : `${name} from ${company} was interested in your portfolio`;
    
    // Return validated data (caller will invoke sendEmail)
    return {
        success: true,
        name: name.trim(),
        email: email ? email.trim() : '',
        phoneNumber: phoneNumber ? phoneNumber.trim() : '',
        company: company.trim(),
        finalComment: finalComment
    };
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Validates phone number (French +33 or international format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
function isValidPhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') return false;
    // Remove spaces, dashes, dots, and parentheses for validation
    const cleaned = phone.replace(/[\s\-\.()]/g, '');
    // French format: +33 followed by 9 digits, or 0 followed by 9 digits
    // International format: + followed by country code (1-3 digits) and 6-14 more digits
    const phoneRegex = /^(\+33[1-9][0-9]{8}|0[1-9][0-9]{8}|\+[1-9][0-9]{1,2}[0-9]{6,14})$/;
    return phoneRegex.test(cleaned);
}

/**
 * Sends an email using a mailing API
 * Currently configured for EmailJS or similar API
 * @param {string} target - Target email address
 * @param {string} title - Email subject
 * @param {string} content - Email body content
 * @param {string} senderEmail - Sender's email
 * @param {string} senderPhone - Sender's phone
 * @returns {void}
 */
function sendEmail(target, title, content, senderEmail = '', senderPhone = '') {
    if (typeof emailjs === 'undefined') {
        showError('Email service is not available. Please try again later.');
        console.error('EmailJS is not loaded.');
        return;
    }

    // Validate target email
    if (!target || !isValidEmail(target)) {
        showError('Invalid recipient email address.');
        console.error('Invalid target email:', target);
        return;
    }

    // Sanitize and format email content
    const sanitizedContent = escapeHtml(content);
    const contactInfo = [];
    if (senderEmail) contactInfo.push(`Email: ${escapeHtml(senderEmail)}`);
    if (senderPhone) contactInfo.push(`Phone: ${escapeHtml(senderPhone)}`);
    
    const emailContent = [
        sanitizedContent,
        '',
        '---',
        'Contact Information:',
        ...contactInfo
    ].join('\n');
    
    // Configuration for EmailJS (or similar service)
    // You'll need to set up your EmailJS account and add your public key
    const serviceID = 'service_id'; // Replace with your service ID
    const templateID = 'template_id'; // Replace with your template ID
    const publicKey = 'public_key'; // Replace with your public key
    
    // Validate EmailJS credentials before attempting to send
    const isValidCredentials = serviceID && templateID && publicKey && 
        serviceID !== 'service_id' && 
        templateID !== 'template_id' && 
        publicKey !== 'public_key';
    
    if (!isValidCredentials) {
        console.warn('EmailJS credentials are not configured. Missing or placeholder values detected:');
        if (serviceID === 'service_id' || !serviceID) console.warn('  - serviceID is missing or placeholder');
        if (templateID === 'template_id' || !templateID) console.warn('  - templateID is missing or placeholder');
        if (publicKey === 'public_key' || !publicKey) console.warn('  - publicKey is missing or placeholder');
        
        // Fallback: Log to console only on local dev to avoid leaking data
        const isLocalDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        if (isLocalDev) {
            console.log('Email would be sent with the following content:');
            console.log({ target, title, content: emailContent });
        }
        showInfo('Preview only — no email was sent. EmailJS is not configured.');
        return;
    }
    
    const templateParams = {
        to_email: target,
        from_name: escapeHtml(title),
        message: emailContent,
        reply_to: senderEmail
    };
    
    // Initialize EmailJS only once (use module variable, don't modify third-party object)
    if (!emailJsInitialized) {
        emailjs.init(publicKey);
        emailJsInitialized = true;
    }
    
    // Send email
    emailjs.send(serviceID, templateID, templateParams)
        .then(() => {
            showSuccess('Email sent successfully!');
            resetContactForm();
        })
        .catch((error) => {
            showError('Failed to send email. Please try again later.');
            console.error('Email error:', error);
        });
}

/**
 * Highlights skills in a project when hovered
 * Adds CSS class to matching skills in the skill list
 * @param {HTMLElement} projectElement - The project box element
 * @param {string[]} skillList - Array of skills in the project
 * @param {boolean} isHovering - True if hovering, false if leaving
 * @returns {void}
 */
function highlightSkill(projectElement, skillList, isHovering) {
    if (!projectElement || !skillList || skillList.length === 0) return;
    
    skillList.forEach(skill => {
        const skillKey = normalizeSkillKey(skill);
        // Escape for CSS selector (handles the already-encoded URI component)
        const escapedKey = safeCssEscape(skillKey);
        const skillElements = document.querySelectorAll(`[data-skill="${escapedKey}"]`);
        skillElements.forEach(element => {
            if (isHovering) {
                element.classList.add('skill-highlighted');
            } else {
                element.classList.remove('skill-highlighted');
            }
        });
    });
}

/**
 * Attaches highlight listeners to a project box
 * @param {string} projectId - ID of the project element
 * @param {string[]} skillList - Array of skills in the project
 * @returns {void}
 */
function attachHighlightListeners(projectId, skillList) {
    if (!projectId || !skillList || skillList.length === 0) return;
    
    const projectElement = document.getElementById(projectId);
    if (!projectElement) {
        console.warn(`Project element with ID "${projectId}" not found`);
        return;
    }
    
    projectElement.addEventListener('mouseenter', () => {
        highlightSkill(projectElement, skillList, true);
    });
    
    projectElement.addEventListener('mouseleave', () => {
        highlightSkill(projectElement, skillList, false);
    });
}

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
function showError(message) {
    showMessage('error', message);
}

/**
 * Shows a success message to the user
 * @param {string} message - Success message
 * @returns {void}
 */
function showSuccess(message) {
    showMessage('success', message);
}

/**
 * Shows an info message to the user
 * @param {string} message - Info message
 * @returns {void}
 */
function showInfo(message) {
    showMessage('info', message);
}

/**
 * Resets the contact form
 * @returns {void}
 */
function resetContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.reset();
    }
}

// Delegate project box toggling to avoid inline handlers (CSP-friendly)
// Wait for DOM to be ready before attaching event listeners
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectToggle);
} else {
    initProjectToggle();
}

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
