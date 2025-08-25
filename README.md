# HR Onboarding Portal

## Project Overview
A full-stack employee onboarding and HR management portal built using the MEARN stack (MongoDB, Express, Angular, React, Node.js). Developed during a 3-week bootcamp sprint with a team of 4 developers.
This portal allows employees to register, upload documents, track onboarding progress, and manage visa/housing info. HR users can manage applications, documents, employee profiles, and housing assignments.

## Key Features
### Employee Portal (React):
- Registration via HR-generated token & email invite
- Onboarding application submission & status tracking
- File uploads (SSN, Visa, Driver’s License) to AWS S3
- OPT Visa document tracking (OPT Receipt → I-20 flow)
- Personal info editor, emergency contacts
- Housing details & facility issue reporting

### HR Portal (Angular):
- Admin dashboard with employee search & profile management
- Onboarding application review (approve/reject with feedback)
- Visa document approval workflow
- Housing unit management and facility report tracking

## Tech Stack
### Frontend:
- React (Employee) + Material UI
- Angular (HR) + Angular Material

### Backend:
- Node.js + Express (MVC Architecture)

### Database:
- MongoDB (Mongoose)

### Cloud:
- AWS S3 for file uploads

### Other Tools:
- Jira for project management
- Git/GitHub for version control
- EmailJS for email notifications
- JWT for auth, bcrypt for password hashing

## How to run locally
### 1. Clone the repository
- git clone https://github.com/yourusername/hr-onboarding-portal.git
- cd hr-onboarding-portal

### 2. Set up backend:
- cd server
- npm install
- npm start

### 3. Set up employee frontend
- cd client-react
- npm install
- npm start

### 4. Set up HR frontend
- cd client-angular
- npm install
- ng serve

### .env example in backend (./server)
- PORT=5000
- MONGO_URI=your_mongo_uri
- JWT_SECRET=your_secret
- AWS_ACCESS_KEY=...
- AWS_SECRET_KEY=...

## Team Roles
### Sajan Aryal (Team Lead)
- Led project setup, Jira planning, and GitHub workflows; coordinated daily standups and task assignments
- Designed backend architecture and employee authentication with JWT; built core HR workflows (invite links, application review with feedback)
- Developed React onboarding form and Angular views for hiring management with approval/rejection logic

### Yuqin Zhang (Scott)
- Built employee personal information UI with editable sections, modal confirmations, and form state handling
- Developed housing view and HR dashboard tabs with route navigation, logout functionality, and employee search/filter
- Implemented HR employee directory with profile linking and tab-based layout in Angular

### Guanhong Jiang (Kevin)
- Designed Document schema and integrated AWS S3 for secure uploads and previews
- Built visa document workflow (OPT Receipt → I-20) with sequential uploads and feedback handling
- Developed HR tools to monitor visa progress and send automated email reminders for next steps

### Sung Je Moon (Jay)
- Built global navigation bar with route highlighting and role-based conditional rendering
- Implemented facility issue reporting with threaded comment threads and personal report list view
- Developed HR housing management panel to view properties, assign residents, and manage facility reports

## Lessons Learned
- Efficient team coordination via daily standups and story-pointing in Jira
- Deep understanding of frontend/backend integration across different frameworks
- Managing real-world features like secure file uploads, document workflows, and cloud deployment
