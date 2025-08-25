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
- React (Employee) + Redux + Material UI
- Angular (HR) + NgRx + Angular Material

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

## Lessons Learned
- Efficient team coordination via daily standups and story-pointing in Jira
- Deep understanding of frontend/backend integration across different frameworks
- Managing real-world features like secure file uploads, document workflows, and cloud deployment
