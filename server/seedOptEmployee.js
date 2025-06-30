const mongoose = require('mongoose');
const Employee = require('./models/Employee');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hr-system')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const createOptEmployee = async () => {
  try {
    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ email: 'opt.test@example.com' });
    
    if (existingEmployee) {
      console.log('OPT test employee already exists');
      return;
    }

    // Create OPT employee with correct visa structure
    const optEmployee = new Employee({
      firstName: 'John',
      lastName: 'Doe',
      username: 'opt.test',
      email: 'opt.test@example.com',
      password: 'password123',
      role: 'employee',
      isCitizen: false,
      citizenshipStatus: 'other',
      visa: {
        type: 'F1',  // This should be 'F1' according to the model
        title: 'OPT', // This can be 'OPT' as a string
        startDate: new Date('2024-01-15'),
        endDate: new Date('2025-01-14')
      },
      onboardingStatus: 'Pending'
    });

    await optEmployee.save();
    console.log('OPT test employee created successfully');
    console.log('Employee ID:', optEmployee._id);
    console.log('Email:', optEmployee.email);
    console.log('Password: password123');
    console.log('Visa structure:', optEmployee.visa);
    
  } catch (error) {
    console.error('Error creating OPT employee:', error);
  } finally {
    mongoose.connection.close();
  }
};

createOptEmployee(); 