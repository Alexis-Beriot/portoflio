// Portfolio Functions for Alexis BERIOT

// Module-level counter for unique project IDs
let projectCounter = 0;

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, char => map[char]);
}

/**
 * Toggles a project box between expanded and collapsed states
 * Changes the state from 1 (large) to 0 (small) or vice versa
 */
function toggleProjectBox(projectElement) {
    if (!projectElement) return;
    
    const isExpanded = projectElement.dataset.expanded === '1';
    projectElement.dataset.expanded = isExpanded ? '0' : '1';
    
    if (isExpanded) {
        projectElement.classList.remove('project-large');
        projectElement.classList.add('project-small');
    } else {
        projectElement.classList.remove('project-small');
        projectElement.classList.add('project-large');
    }
}

/**
 * Develops a project box with the specified parameters
 * @param {number} big - 1 for large box (longInfo), 0 for small box (shortInfo)
 * @param {number} type - 1 for year (personal projects), 0 for school
 * @param {string} category - Project category/school name
 * @param {string} shortInfo - Short description
 * @param {string} longInfo - Long/detailed description
 * @param {array} skillList - Array of skills used in the project
 * @returns {string} HTML string for the project box
 */
function developProject(big, type, category, shortInfo, longInfo, skillList = []) {
    const projectId = `project-${Date.now()}-${++projectCounter}`;
    const sizeClass = big === 1 ? 'project-large' : 'project-small';
    const content = big === 1 ? longInfo : shortInfo;
    const typeLabel = type === 1 ? 'Personal Project' : 'School Project';
    
    // Escape all user-controlled values to prevent XSS
    const escapedCategory = escapeHtml(category);
    const escapedContent = escapeHtml(content);
    
    let skillsHtml = '';
    if (skillList && skillList.length > 0) {
        skillsHtml = '<div class="skills-container">' + 
            skillList.map(skill => `<span class="skill-tag" data-skill="${escapeHtml(skill)}">${escapeHtml(skill)}</span>`).join('') + 
            '</div>';
    }
    
    const html = `
        <div id="${projectId}" class="project-box ${sizeClass}" data-expanded="${big}" onclick="toggleProjectBox(this)">
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
 * Switches between English and French language versions
 * @param {number} lang - 1 for English, 0 for French
 */
function switchLanguage(lang) {
    let currentUrl = window.location.pathname;
    let newUrl;
    
    if (lang === 1) {
        // Switch to English - remove "-fr" before ".html"
        newUrl = currentUrl.replace(/-fr(\.html)$/i, '$1');
    } else {
        // Switch to French - add "-fr" before ".html"
        // Check if already ends with "-fr.html" to avoid duplicate "-fr-fr"
        if (!/-fr\.html$/i.test(currentUrl)) {
            // Use safe replace targeting only the extension
            newUrl = currentUrl.replace(/(\.html)$/i, '-fr$1');
        } else {
            newUrl = currentUrl;
        }
    }
    
    // Only navigate if URL changed
    if (newUrl !== currentUrl) {
        window.location.href = newUrl;
    }
}

/**
 * Validates the contact form with multiple checks
 * @param {string} name - Contact name
 * @param {string} email - Contact email (optional)
 * @param {string} phoneNumber - Contact phone (optional)
 * @param {string} company - Company name
 * @param {string} comment - Message content
 * @returns {boolean} True if valid, false otherwise
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
        : `${name} from ${company} was interested by your portfolio`;
    
    // Send email with validated data
    sendEmail('alexis.r.beriot@gmail.com', `${name} - ${company}`, finalComment, email, phoneNumber);
    
    return true;
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates phone number (French +33 or international format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
function isValidPhoneNumber(phone) {
    const phoneRegex = /^(\+33|0)[1-9](?:[0-9]{8})$|^\+(?:[0-9]{1,3})?[0-9]{6,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-\.]/g, ''));
}

/**
 * Sends an email using a mailing API
 * Currently configured for EmailJS or similar API
 * @param {string} target - Target email address
 * @param {string} title - Email subject
 * @param {string} content - Email body content
 * @param {string} senderEmail - Sender's email
 * @param {string} senderPhone - Sender's phone
 */
function sendEmail(target, title, content, senderEmail = '', senderPhone = '') {
    // Format email content
    const emailContent = `
        ${content}
        
        ---
        Contact Information:
        ${senderEmail ? `Email: ${senderEmail}` : ''}
        ${senderPhone ? `Phone: ${senderPhone}` : ''}
    `;
    
    // Configuration for EmailJS (or similar service)
    // You'll need to set up your EmailJS account and add your public key
    const serviceID = 'service_id'; // Replace with your service ID
    const templateID = 'template_id'; // Replace with your template ID
    const publicKey = 'public_key'; // Replace with your public key
    
    const templateParams = {
        to_email: target,
        from_name: title,
        message: emailContent,
        reply_to: senderEmail
    };
    
    // Uncomment when EmailJS is set up
    /*
    emailjs.init(publicKey);
    emailjs.send(serviceID, templateID, templateParams)
        .then(() => {
            showSuccess('Email sent successfully!');
            resetContactForm();
        })
        .catch((error) => {
            showError('Failed to send email. Please try again later.');
            console.error('Email error:', error);
        });
    */
    
    // Fallback: Log to console for development
    console.log('Email would be sent with the following content:');
    console.log({ target, title, content: emailContent });
    showInfo('Preview only — no email was sent. EmailJS is not configured.');
}

/**
 * Highlights skills in a project when hovered
 * Adds CSS class to matching skills in the skill list
 * @param {HTMLElement} projectElement - The project box element
 * @param {array} skillList - Array of skills in the project
 * @param {boolean} isHovering - True if hovering, false if leaving
 */
function highlightSkill(projectElement, skillList, isHovering) {
    if (!projectElement || !skillList || skillList.length === 0) return;
    
    skillList.forEach(skill => {
        const skillElements = document.querySelectorAll(`[data-skill="${skill}"]`);
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
 * @param {array} skillList - Array of skills in the project
 */
function attachHighlightListeners(projectId, skillList) {
    const projectElement = document.getElementById(projectId);
    if (!projectElement) return;
    
    projectElement.addEventListener('mouseenter', () => {
        highlightSkill(projectElement, skillList, true);
    });
    
    projectElement.addEventListener('mouseleave', () => {
        highlightSkill(projectElement, skillList, false);
    });
}

/**
 * Shows an error message to the user
 * @param {string} message - Error message
 */
function showError(message) {
    const errorDiv = document.getElementById('error-message') || document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    if (!document.getElementById('error-message')) {
        document.body.insertBefore(errorDiv, document.body.firstChild);
    }
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

/**
 * Shows a success message to the user
 * @param {string} message - Success message
 */
function showSuccess(message) {
    const successDiv = document.getElementById('success-message') || document.createElement('div');
    successDiv.id = 'success-message';
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    if (!document.getElementById('success-message')) {
        document.body.insertBefore(successDiv, document.body.firstChild);
    }
    
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

/**
 * Shows an info message to the user
 * @param {string} message - Info message
 */
function showInfo(message) {
    const infoDiv = document.getElementById('info-message') || document.createElement('div');
    infoDiv.id = 'info-message';
    infoDiv.className = 'info-message';
    infoDiv.textContent = message;
    infoDiv.style.display = 'block';
    
    if (!document.getElementById('info-message')) {
        document.body.insertBefore(infoDiv, document.body.firstChild);
    }
    
    setTimeout(() => {
        infoDiv.style.display = 'none';
    }, 5000);
}

/**
 * Resets the contact form
 */
function resetContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.reset();
    }
}
