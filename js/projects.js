/**
 * Project Box Management Module
 * 
 * This module handles all project box functionality:
 * - Creating project boxes with HTML
 * - Toggling between expanded and collapsed states
 * - Skill highlighting on hover
 * - Event listener management
 * 
 * @author Alexis BERIOT
 * @version 2.0.0
 * @license MIT
 */
'use strict';

import { PROJECT_STATE, PROJECT_TYPE, incrementProjectCounter } from './constants.js';
import { escapeHtml, normalizeSkillKey, safeCssEscape } from './security.js';

/**
 * Toggles a project box between expanded and collapsed states
 * Changes the state from 1 (large) to 0 (small) or vice versa
 * @param {HTMLElement} projectElement - The project element to toggle
 * @returns {void}
 */
export function toggleProjectBox(projectElement) {
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
export function developProject(big, type, category, shortInfo, longInfo, skillList = []) {
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
        uniqueId = `${Date.now()}-${incrementProjectCounter()}`;
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
 * Highlights skills in a project when hovered
 * Adds CSS class to matching skills in the skill list
 * @param {HTMLElement} projectElement - The project box element
 * @param {string[]} skillList - Array of skills in the project
 * @param {boolean} isHovering - True if hovering, false if leaving
 * @returns {void}
 */
export function highlightSkill(projectElement, skillList, isHovering) {
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
export function attachHighlightListeners(projectId, skillList) {
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
