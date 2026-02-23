# Portfolio: Alexis BERIOT

## [What's Needed]

### 1. Skills

#### 1.0 General Programming
* a. Project Management Methods (schematisation, sprints, )
* b. Database use and creation (MySQL, PostGresSQL, SQLite)

#### 1.1 Web Programming
* a. Languages (HTML, CSS, PHP, JS)
* b. Cross Compatible API Creation
* c. Web Frameworks (Bootstrap, Tailwind, Laravel)

#### 1.2 Cybersecurity
* a. Use of common tools (wireshark, postman, page inpection)
* b. Knowledge of common exploits and hacks and how to counter them (SQL Injection, XSS, Bruteforce, etc...)
* c. Knowledge of encryption methods (Single key encryption and public/private key encryption)

#### 1.3 Software Programming
* a. Java application creation
* b. Android compatible app creation
* c. Cross-compatible API Usage
* d. Chip-imbedded code

### 2. School Projects

#### 2.1 Epitech - Bachelor [latest]
* a. Hackaton: Product Design - Creating an app to compare the eco-friendly infrastructure of different cities, town, localities, etc...
* b. YOWL - Designing & doing the entire pre-production part of a Social Media project (not meant to go further than pre-prod)
* c. HackAndJuice - Finding Exploit-Flags on a security-flaw ridden website
* d. Etodo - Agenda Web App
* e. Digital Resume - Resume posting site (light project)
* English: Validation of a TOEIC-like language test with 880+ points out of 990

#### 2.2 ORT Lyon - BTS SIO
* a. Internship: DRAAF - Creating a GLPI Database scraper to collect the list of all the listed tools for each employee, for the DRAAF (French bureau of agricultural aid)
* b. Creation of a database manipulation (CRUD-capable) website using Laravel
* c. Internship: Restaurant - Creation of a website presenting the restaurant, opening hours, the menu and making an easily modifiable "dish of the day" page for the owner
* d. Implementation of a local network at the scale of a small company
* e. Creation of a small website for a professional psychiatrist
* f. Creation, in Java, of a shop coin & bill machine to allow to validate, buy items and give out change
* English: Validation of the TOEIC with 780+ points out of 990

#### 2.3 IUT Lyon 2 Gratte-Ciel - BUT GEII [earliest]
* a. Designing and programming of a custom programmable chip for use in other projects
* b. Creation of a keycard scanner and program for a car-park barrier
* c. Passed tests to operate on high-voltage equipment while wearing protective gear
* d. Production/Wiring logic based systems like an Elevator, Factory production machine and Smaller systems like a counter and some LED alerts

### 3. Personal Projects
* Designing of an Online Card-game based on Fallout: New Vegas' "Caravan" Card Game
* Creation of a TTRPG Character-sheet database & API (compatible with any system)
* Designing of a Prop/toy laser-pistol based on Fallout 1's Wattz 1000 Laser Pistol. (Unfinished)

## [Site Pages]

### 1. Presentation
__Description:__
Welcome page, shows a short list of skills that can be developped, below that, shows the top 3 prefered projects and links to both of the project pages & the contact page below

### 2. Skills (can be developped in Presentation page)
__Description:__
Detailed list of skills aquired

### 3. Student Projects
__Description:__
List and thumbnails of each project categorised in the different schools.
For each Project, there is a small description and it can be developped if you click on the project to get more info.

### 4. Personal Projects
__Description:__
List and thumbnails of each project categorised in the different years.
For each Project, there is a small description and it can be developped if you click on the project to get more info.

### 5. Contact page
__Description:__
Contact information (mail) and a form to fill in a name, email/phone number, and company title, that automatically sends an email to my inbox.

## [Limitations]
* No SQL / Database, the site should be fully static

## [External Libraries & Dependencies]

### EmailJS (v4.x)
* **Purpose**: Enables client-side email sending for the contact form without requiring a backend server
* **CDN Link**: `https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js`
* **Integration**: Included via `<script>` tag in the `<head>` section of all HTML pages
* **Configuration Required**:
  - Service ID: Replace `'service_id'` in portfolio.js
  - Template ID: Replace `'template_id'` in portfolio.js
  - Public Key: Replace `'public_key'` in portfolio.js
* **Setup Instructions**:
  1. Create free account at https://www.emailjs.com/
  2. Add email service (Gmail, Outlook, etc.)
  3. Create email template
  4. Copy Service ID, Template ID, and Public Key
  5. Update values in `sendEmail()` function in portfolio.js
* **Fallback Behavior**: If credentials not configured, displays info message on localhost (preview mode)

### Custom Scripts
* **portfolio.js**: Core functionality module containing all portfolio features
  - Included via `<script src="portfolio.js" defer></script>` in all HTML pages
  - Uses `defer` attribute to ensure DOM is ready before execution

## [Implementation Details]

### Security Features
* **Strict Mode**: Enabled for better error checking and performance
* **XSS Prevention**: All user inputs are escaped before rendering
* **Input Validation**: Comprehensive validation on all form inputs and function parameters
* **CSP-Friendly**: Event delegation instead of inline handlers
* **ARIA Compliance**: Accessible alert messages with proper ARIA attributes

### Best Practices
* **Constants**: Magic numbers replaced with semantic constants (PROJECT_STATE, PROJECT_TYPE, LANGUAGE)
* **Unique IDs**: Uses crypto.randomUUID() with timestamp fallback for project identification
* **DRY Principle**: Message display logic consolidated in showMessage() helper
* **Error Handling**: Graceful degradation and user-friendly error messages
* **Initialization Safety**: Prevents duplicate event listener registration
* **Browser Compatibility**: Fallbacks for older browsers (CSS.escape, crypto.randomUUID)

## [Constants]

* `PROJECT_STATE` - Object with LARGE (1) and SMALL (0) properties for project box sizes
* `PROJECT_TYPE` - Object with PERSONAL (1) and SCHOOL (0) properties for project categories
* `LANGUAGE` - Object with ENGLISH (1) and FRENCH (0) properties for language switching

## [Functions Implemented]

### Core Functions

* `toggleProjectBox(projectElement)`
    - Toggles a project box between expanded (large) and collapsed (small) states
    - Uses classList.toggle() for efficient class management
    - Updates data-expanded attribute (1 for large, 0 for small)
    - Triggered automatically via event delegation on click

* `developProject(big, type, category, shortInfo, longInfo, skillList = [])`
    - **Parameters:**
        - `big`: PROJECT_STATE.LARGE (1) for large box with longInfo, PROJECT_STATE.SMALL (0) for small box with shortInfo
        - `type`: PROJECT_TYPE.PERSONAL (1) for personal projects, PROJECT_TYPE.SCHOOL (0) for school projects
        - `category`: Project title/category name (string, required)
        - `shortInfo`: Brief description (string, required)
        - `longInfo`: Detailed description (string, required)
        - `skillList`: Array of skill strings (optional, defaults to empty array)
    - **Returns:** HTML string for the project box
    - **Features:**
        - Validates all parameters before processing
        - Uses crypto.randomUUID() for unique IDs (fallback to timestamp-based)
        - Escapes all user input to prevent XSS attacks
        - Generates skill tags with proper data attributes for highlighting
        - Returns empty string if validation fails

* `switchLanguage(lang)`
    - **Parameters:**
        - `lang`: LANGUAGE.ENGLISH (1) or LANGUAGE.FRENCH (0)
    - **Behavior:**
        - Validates language parameter
        - English: removes "-fr" before ".html" in URL
        - French: adds "-fr" before ".html" in URL
        - Normalizes non-HTML routes to index.html
        - Preserves URL search parameters and hash
        - Only navigates if path actually changes
        - Prevents duplicate "-fr-fr" patterns

* `validateContactForm(name, email, phoneNumber, company, comment)`
    - **Validation checks:**
        - Name is required (non-empty string)
        - Company is required (non-empty string)
        - At least one contact method required (email OR phone)
        - Email format validation (if provided)
        - Phone number validation: French (+33 or 0) or international format
    - **Returns:** 
        - Object with validated data on success: `{success: true, name, email, phoneNumber, company, finalComment}`
        - `false` on validation failure
    - **Default comment:** "[name] from [company] was interested in your portfolio"
    - Displays user-friendly error messages via showError()

* `sendEmail(target, title, content, senderEmail = '', senderPhone = '')`
    - **Parameters:**
        - `target`: Recipient email address (validated)
        - `title`: Email subject line
        - `content`: Email body content
        - `senderEmail`: Sender's email (optional)
        - `senderPhone`: Sender's phone (optional)
    - **Features:**
        - Validates target email address
        - Sanitizes all inputs with escapeHtml()
        - Formats contact information in email footer
        - Uses EmailJS API (requires configuration: serviceID, templateID, publicKey)
        - Graceful fallback: logs preview on localhost if credentials not configured
        - Initializes EmailJS only once per session
        - Shows success/error messages to user
        - Resets contact form on successful send

### Skill Highlighting

* `highlightSkill(projectElement, skillList, isHovering)`
    - **Parameters:**
        - `projectElement`: The project box HTML element
        - `skillList`: Array of skill strings
        - `isHovering`: Boolean (true when mouse enters, false when leaves)
    - **Behavior:**
        - Finds all skill tags matching the project's skills
        - Adds/removes 'skill-highlighted' CSS class
        - Uses normalized skill keys for matching

* `attachHighlightListeners(projectId, skillList)`
    - **Parameters:**
        - `projectId`: ID of the project element
        - `skillList`: Array of skill strings
    - **Behavior:**
        - Validates inputs before processing
        - Attaches mouseenter/mouseleave event listeners
        - Warns in console if project element not found

### User Messaging

* `showError(message)` - Displays error message (red alert, 5 second duration)
* `showSuccess(message)` - Displays success message (green alert, 5 second duration)
* `showInfo(message)` - Displays info message (blue alert, 5 second duration)
* `showMessage(type, message, duration = 5000)` - Generic message display (private helper)
    - Creates ARIA-compliant alert elements
    - Auto-dismisses after specified duration
    - Prevents message overlap with timer management
    - Works even before DOM ready

### Security & Validation Helpers

* `escapeHtml(text)` - Escapes HTML special characters to prevent XSS attacks
* `normalizeSkillKey(skill)` - Encodes skill strings for safe use in data attributes
* `safeCssEscape(value)` - CSS selector escaping with fallback for older browsers
* `isValidEmail(email)` - Validates email format with regex
* `isValidPhoneNumber(phone)` - Validates French and international phone formats
* `resetContactForm()` - Resets the contact form after successful submission

### Initialization

* `initProjectToggle()` - Initializes click event delegation for project box toggling
    - Prevents duplicate initialization
    - Uses CSP-friendly event delegation
    - Waits for DOM ready before attaching listeners

## [EmailJS Configuration Required]

To enable email functionality, replace placeholder values in sendEmail():
```javascript
const serviceID = 'your_service_id';
const templateID = 'your_template_id';
const publicKey = 'your_public_key';
```

Target email: alexis.r.beriot@gmail.com