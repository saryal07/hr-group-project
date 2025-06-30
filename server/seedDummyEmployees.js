// seedDummyEmployees.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Employee = require('./models/Employee');
const Housing = require('./models/Housing');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Create dummy employees
const createDummyEmployees = async () => {
  try {
    console.log('🚀 Creating dummy employees...');

    // Hash password for all dummy employees
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Dummy employee data
    const dummyEmployees = [
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        middleName: 'Marie',
        preferredName: 'Ali',
        username: 'alice.johnson',
        email: 'alice.johnson@company.com',
        password: hashedPassword,
        cellPhone: '555-234-5678',
        workPhone: '555-234-5679',
        role: 'employee',
        car: {
          make: 'Toyota',
          model: 'Camry',
          color: 'Silver',
        },
        address: {
          building: '4B',
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zip: '10001',
        },
        onboardingStatus: 'Approved',
      },
      {
        firstName: 'Bob',
        lastName: 'Chen',
        middleName: 'Wei',
        preferredName: 'Bobby',
        username: 'bob.chen',
        email: 'bob.chen@company.com',
        password: hashedPassword,
        cellPhone: '555-345-6789',
        workPhone: '555-345-6790',
        role: 'employee',
        car: {
          make: 'Honda',
          model: 'Civic',
          color: 'Blue',
        },
        address: {
          building: '4B',
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zip: '10001',
        },
        onboardingStatus: 'Approved',
      },
    ];

    // Create employees in database
    const createdEmployees = [];
    for (const employeeData of dummyEmployees) {
      // Check if employee already exists
      const existingEmployee = await Employee.findOne({
        email: employeeData.email,
      });
      if (existingEmployee) {
        console.log(
          `⚠️  Employee ${employeeData.email} already exists, skipping...`
        );
        createdEmployees.push(existingEmployee);
        continue;
      }

      const employee = new Employee(employeeData);
      const savedEmployee = await employee.save();
      console.log(
        `✅ Created employee: ${savedEmployee.firstName} ${savedEmployee.lastName}`
      );
      createdEmployees.push(savedEmployee);
    }

    return createdEmployees;
  } catch (error) {
    console.error('❌ Error creating dummy employees:', error);
    throw error;
  }
};

// Assign employees to housing
const assignEmployeesToHousing = async (employees) => {
  try {
    console.log('🏠 Assigning employees to housing...');

    // Find the housing by ID
    const housingId = '685ec299005327ec6577759d';
    const housing = await Housing.findById(housingId);

    if (!housing) {
      console.error('❌ Housing not found with ID:', housingId);
      return;
    }

    console.log(`📍 Found housing: ${housing.address}`);

    // Get employee IDs
    const employeeIds = employees.map((emp) => emp._id);

    // Update housing with employee IDs
    housing.employees = employeeIds;
    await housing.save();

    console.log(`✅ Assigned ${employees.length} employees to housing`);
    console.log('👥 Assigned employees:');
    employees.forEach((emp) => {
      console.log(`   - ${emp.firstName} ${emp.lastName} (${emp.email})`);
    });

    // Verify the assignment
    const updatedHousing = await Housing.findById(housingId).populate(
      'employees',
      'firstName lastName email cellPhone'
    );
    console.log('\n🔍 Verification - Housing now has employees:');
    updatedHousing.employees.forEach((emp) => {
      console.log(`   ✓ ${emp.firstName} ${emp.lastName} - ${emp.email}`);
    });
  } catch (error) {
    console.error('❌ Error assigning employees to housing:', error);
    throw error;
  }
};

// Main execution function
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🌱 Starting database seeding...\n');

    // Create dummy employees
    const employees = await createDummyEmployees();

    // Assign employees to housing
    await assignEmployeesToHousing(employees);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • Created ${employees.length} employees`);
    console.log(
      `   • Assigned employees to housing: 123 Main Street, Apartment 4B`
    );
    console.log(`   • Employees can login with:`);
    console.log(`     - Username: alice.johnson, Password: password123`);
    console.log(`     - Username: bob.chen, Password: password123`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding
seedDatabase();
