const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName:  String,
  middleName: String,
  preferredName: String,
  username: { type: String, required: true, unique: true },
  
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 }, // hashed
  
  profilePicUrl: String,

  address: {
    building: String,
    street: String,
    city: String,
    state: String,
    zip: String
  },

  cellPhone: String,
  workPhone: String,

  ssn: String,
  dob: Date,
  gender: { type: String, enum: ['male', 'female', 'prefer not to say'] },

  isCitizen: { type: Boolean, default: false },
  citizenshipStatus: String, // "citizen", "green card", "other"

  visa: {
    type: {
      type: String,
      enum: ['F1', 'H1-B', 'L2', 'H4', 'Other'] // adjust as needed
    },
    title: { type: String },
    startDate: { type: Date },
    endDate: { type: Date }
  },

  hasLicense: { type: Boolean, default: false },
  driversLicense: {
    number: String,
    expirationDate: Date,
    licenseUrl: String
  },

  reference: {
    firstName: String,
    lastName: String,
    middleName: String,
    phone: String,
    email: String,
    relationship: String
  },

  emergencyContacts: [
    {
      firstName: String,
      lastName: String,
      middleName: String,
      phone: String,
      email: String,
      relationship: String
    }
  ],

  hrFeedback: String,

  role: { type: String, enum: ['employee', 'admin'], default: 'employee' },

  onboardingStatus: {
    type: String,
    enum: ['Not Started', 'Pending', 'Approved', 'Rejected'],
    default: 'Not Started'
  }
});

employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// For login password checking
employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Employee', employeeSchema);