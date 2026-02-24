# Portfolio JavaScript Modules

This directory contains the modular JavaScript code for Alexis BERIOT's portfolio website.

## 📁 File Structure

```
js/
├── main.js            - Main entry point and initialization
├── constants.js       - Application constants (PROJECT_STATE, PROJECT_TYPE, LANGUAGE)
├── security.js        - Security utilities (HTML escaping, CSS escaping)
├── validation.js      - Form validation (email, phone, contact form)
├── notifications.js   - User notification system (error, success, info messages)
├── email.js          - Email service integration (EmailJS)
├── projects.js       - Project box management and skill highlighting
└── language.js       - Language switching (English/French)
```

## 🚀 Usage

### For Modern Browsers (ES6 Modules)

Include the main module in your HTML:

```html
<script type="module" src="js/main.js"></script>
```

To use functions in your HTML or other scripts:

```html
<script type="module">
  import { 
    developProject, 
    PROJECT_STATE, 
    PROJECT_TYPE,
    validateContactForm,
    sendEmail,
    switchLanguage,
    LANGUAGE
  } from './js/main.js';

  // Example: Create a project
  const projectHtml = developProject(
    PROJECT_STATE.LARGE,
    PROJECT_TYPE.PERSONAL,
    "My Project",
    "Short description",
    "Long detailed description",
    ["JavaScript", "HTML", "CSS"]
  );
  
  // Example: Switch to French
  switchLanguage(LANGUAGE.FRENCH);
  
  // Example: Validate and send contact form
  const validation = validateContactForm(name, email, phone, company, message);
  if (validation) {
    sendEmail(targetEmail, subject, validation.finalComment, validation.email, validation.phoneNumber);
  }
</script>
```

### For Legacy Browsers

If you need to support older browsers, you'll need to either:

1. **Use a bundler** (like Webpack, Rollup, or Vite) to combine the modules
2. **Use the original portfolio.js** file (kept as legacy support)

## 📋 Module Details

### constants.js
Defines application-wide constants:
- `PROJECT_STATE`: LARGE (1) or SMALL (0)
- `PROJECT_TYPE`: PERSONAL (1) or SCHOOL (0)
- `LANGUAGE`: ENGLISH (1) or FRENCH (0)

### security.js
Security and sanitization utilities:
- `escapeHtml(text)` - Prevents XSS attacks
- `normalizeSkillKey(skill)` - Normalizes skill names for data attributes
- `safeCssEscape(value)` - Escapes values for CSS selectors

### validation.js
Form validation functions:
- `isValidEmail(email)` - Email format validation
- `isValidPhoneNumber(phone)` - Phone validation (French/international)
- `validateContactForm(name, email, phone, company, comment)` - Full form validation

### notifications.js
User notification system:
- `showError(message)` - Display error messages
- `showSuccess(message)` - Display success messages
- `showInfo(message)` - Display info messages

### email.js
Email service integration:
- `sendEmail(target, title, content, senderEmail, senderPhone)` - Send emails via EmailJS
- `resetContactForm()` - Reset the contact form

**Note:** You need to configure EmailJS credentials in [email.js](email.js):
```javascript
const serviceID = 'your_service_id';
const templateID = 'your_template_id';
const publicKey = 'your_public_key';
```

### projects.js
Project box management:
- `developProject(big, type, category, shortInfo, longInfo, skillList)` - Create project HTML
- `toggleProjectBox(projectElement)` - Toggle project expansion
- `highlightSkill(projectElement, skillList, isHovering)` - Highlight skills on hover
- `attachHighlightListeners(projectId, skillList)` - Attach hover listeners

### language.js
Language switching:
- `switchLanguage(lang)` - Switch between English and French versions

### main.js
Main entry point that:
- Imports and re-exports all modules
- Initializes the application
- Sets up project toggle event delegation

## 🔄 Migration from portfolio.js

The original `portfolio.js` file has been split into these modules for:
- **Better organization** - Each module has a single responsibility
- **Easier maintenance** - Find and update code more easily
- **Reusability** - Import only what you need
- **Testing** - Test modules independently
- **Security** - Content Security Policy (CSP) friendly

## 🛠️ Development

To modify the portfolio functionality:

1. Locate the appropriate module based on functionality
2. Make your changes
3. Test the functionality in your browser
4. The changes will be automatically reflected (no build step required for modern browsers)

## 📝 License

MIT License - See main portfolio documentation for details.

## 👤 Author

Alexis BERIOT

---

**Version:** 2.0.0  
**Last Updated:** February 2026
