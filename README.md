# HR Onboarding Portal

## Project Overview
This is a simplified HR onboarding portal built with the MERN stack (MongoDB, Express, React/Angular, Node.js). It allows employees to manage their personal info, upload documents, and track housing status. HR can manage employee data and onboarding processes.

## Create a .env file in root folder (./server)
PORT=3000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production

## run each client and server
cd server && npm install && npm start
cd client-react && npm install && npm start
cd client-angular && npm install && ng serve
