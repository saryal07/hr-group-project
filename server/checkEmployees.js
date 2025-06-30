const mongoose = require('mongoose');
const Employee = require('./models/Employee');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hr-system')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const checkEmployees = async () => {
  try {
    // Get all employees
    const allEmployees = await Employee.find({}).select('firstName lastName email visa role');
    
    console.log(`\n=== Total Employees: ${allEmployees.length} ===\n`);
    
    // Check employees with visa information
    const employeesWithVisa = allEmployees.filter(emp => emp.visa && (emp.visa.type || emp.visa.title));
    
    console.log(`Employees with visa info: ${employeesWithVisa.length}\n`);
    
    employeesWithVisa.forEach((emp, index) => {
      console.log(`${index + 1}. ${emp.firstName} ${emp.lastName} (${emp.email})`);
      console.log(`   Role: ${emp.role}`);
      console.log(`   Visa Type: ${emp.visa.type || 'Not set'}`);
      console.log(`   Visa Title: ${emp.visa.title || 'Not set'}`);
      console.log(`   Start Date: ${emp.visa.startDate || 'Not set'}`);
      console.log(`   End Date: ${emp.visa.endDate || 'Not set'}`);
      console.log('');
    });
    
    // Check for F1 visa employees
    const f1Employees = allEmployees.filter(emp => emp.visa && emp.visa.type === 'F1');
    console.log(`\n=== F1 Visa Employees: ${f1Employees.length} ===\n`);
    
    f1Employees.forEach((emp, index) => {
      console.log(`${index + 1}. ${emp.firstName} ${emp.lastName} (${emp.email})`);
      console.log(`   Visa Title: ${emp.visa.title || 'Not set'}`);
      console.log('');
    });
    
    // Check for OPT employees (F1 type only)
    const optEmployees = allEmployees.filter(emp => 
      emp.visa && 
      emp.visa.type === 'F1'
    );
    
    console.log(`\n=== OPT Employees (visa.type='F1'): ${optEmployees.length} ===\n`);
    
    optEmployees.forEach((emp, index) => {
      console.log(`${index + 1}. ${emp.firstName} ${emp.lastName} (${emp.email})`);
      console.log(`   Start Date: ${emp.visa.startDate}`);
      console.log(`   End Date: ${emp.visa.endDate}`);
      console.log('');
    });
    
    // Check employees without visa info
    const employeesWithoutVisa = allEmployees.filter(emp => !emp.visa || (!emp.visa.type && !emp.visa.title));
    
    console.log(`\n=== Employees without visa info: ${employeesWithoutVisa.length} ===\n`);
    
    employeesWithoutVisa.forEach((emp, index) => {
      console.log(`${index + 1}. ${emp.firstName} ${emp.lastName} (${emp.email}) - Role: ${emp.role}`);
    });
    
  } catch (error) {
    console.error('Error checking employees:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkEmployees(); 