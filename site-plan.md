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
* Internship: Restaurant - Creation of a website presenting the restaurant, openning hours, the menu and making an easily modifiable "dish of the day" page for the owner
* Implementation of a local network at the scale of a small company
* Creation of a small website for a professionnal psychiatrist
* Creation, in Java, of a shop coin & bill machine to allow to validate, buy items and give out change
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

## [Functions Needed]

* `toggleProjectBox()`
(how it should function:
    - this function toggles a box made with developProject() into a small or large one when the project is clicked on
    - if current state of developProject() is 1 it becomes 0 and vice-versa
)

* `developProject(big(1)/small(0), year(1)|school(0), category, shortInfo, longInfo, [skillList])`
(how it should function:
    - deployed, it should look like this: developProject(x, showProject(...))
    - If the first variable is a 1, the project is put in a large box with the longInfo written
    - If the first variable is a 0, the project is put in a medium box with the shortInfo written
)

* `switchLanguage(english(1)/français(0))`
(how it should function:
    - if switching to english go to page with same url minus the last 3 chars before ".html"
    - if switching from english to french, go to page with same url but add "-fr" before ".html"
)

* `validateContactForm(name, email/NULL, phoneNumber/NULL, company, comment)`
(how it should function:
    - check if there is a name, if not, send error
    - check if there is a company, if not, send error
    - checks if there is either phone number or email, if there is not, bring up error
    - checks if email is valid (if there is an email given), if not, bring up error
    - checks if phone number is valid (+33 (french) or international), if not, bring up error
    - checks if there are any comment, if not, the email should have a default content instead of the (non-existing) comment
        - default comment is "[name] from [company] was interrested by your portfolio", if there already exists a comment, dont do that
    - if everything is valid, send an email with the collected info using the sendEmail() function.
        - it should be like the following: sendEmail(alexis.r.beriot@gmail.com, [name]+" "+[company], [comment]+" contacts at"+[email]+", "+[phoneNumber]) (but formated like an actual email)
)

* `sendEmail(target, title, content)`
(how it should function:
    - use a mailing API to send an email with the title and content to the targeted email inbox (mine)
        - target inbox is "alexis.r.beriot@gmail.com"
)

* highlightSkill(skill, [skillList])
(how it should function:
    - when a projectBox is hovered on by the user, the skills within the project's skillList are highlighted until the hovering of the project stops
        - highlighting is a css class change using javaScript
    - if the skill is in the skillList, instead of returning just the html line, return the line but with the correct css class change
)