/**
 * Form Validation Functions
 * 
 * This module provides validation utilities for:
 * - Email address validation
 * - Phone number validation (French and international formats)
 * - Contact form validation
 * 
 * @author Alexis BERIOT
 * @version 2.0.0
 * @license MIT
 */
'use strict';

import { showError } from './notifications.js';

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Validates phone number (French +33 or international format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export function isValidPhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') return false;
    // Remove spaces, dashes, dots, and parentheses for validation
    const cleaned = phone.replace(/[\s\-\.()]/g, '');
    // French format: +33 followed by 9 digits, or 0 followed by 9 digits
    // International format: + followed by country code (1-3 digits) and 6-14 more digits
    const phoneRegex = /^(\+33[1-9][0-9]{8}|0[1-9][0-9]{8}|\+[1-9][0-9]{1,2}[0-9]{6,14})$/;
    return phoneRegex.test(cleaned);
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
export function validateContactForm(name, email, phoneNumber, company, comment) {
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
