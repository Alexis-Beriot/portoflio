/**
 * Email Service Module
 * 
 * This module handles email sending functionality using EmailJS:
 * - Email sending via EmailJS API
 * - Contact form reset
 * - Email validation and sanitization
 * 
 * @author Alexis BERIOT
 * @version 2.0.0
 * @license MIT
 */
'use strict';

import { escapeHtml } from './security.js';
import { isValidEmail } from './validation.js';
import { showError, showSuccess, showInfo } from './notifications.js';

// Track EmailJS initialization separately (don't modify third-party objects)
let emailJsInitialized = false;

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
export function sendEmail(target, title, content, senderEmail = '', senderPhone = '') {
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
 * Resets the contact form
 * @returns {void}
 */
export function resetContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.reset();
    }
}
