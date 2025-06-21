const bcrypt = require('bcryptjs');
const Employee = require('./models/Employee');
require('dotenv').config();
const connectDB = require('./config/db');
connectDB();

async function createAdmin() {

  await Employee.create({
    email: 'hr@beaconfireinc.com',
    password: 'adminpass9',
    username: 'adminhr',
    role: 'admin' // hr
  });

  console.log('Admin created');
}

createAdmin();