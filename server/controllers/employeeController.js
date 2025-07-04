const Employee = require('../models/Employee');
const asyncHandler = require('express-async-handler');

// GET /employee/me
const getMe = asyncHandler(async (req, res) => {
  const user = await Employee.findById(req.user.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json(user);
});

// submit form data (onboarding page)
const submitForm = asyncHandler(async (req, res) => {
  const updates = { ...req.fields };

  // Parse nested JSON fields that were sent as strings
  const jsonFields = ['address', 'car', 'visa', 'driversLicense', 'reference', 'emergencyContacts'];

  for (const field of jsonFields) {
    if (updates[field]) {
      try {
        updates[field] = JSON.parse(updates[field]);
      } catch (e) {
        console.error(`Failed to parse ${field}`, e);
      }
    }
  }

  const user = await Employee.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update onboardingStatus if necessary
  const onboardingFields = [
    'firstName', 'lastName', 'dob', 'ssn', 'address',
    'visa', 'driversLicense', 'reference', 'emergencyContacts'
  ];
  const isOnboarding = onboardingFields.some(f => updates[f]);
  if (isOnboarding && ['Not Started', 'Rejected'].includes(user.onboardingStatus)) {
    updates.onboardingStatus = 'Pending';
  }

  const updatedUser = await Employee.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true
  }).select('-password');

  res.status(200).json(updatedUser);
});

// PUT /employee/me
const updateMe = asyncHandler(async (req, res) => {
  const updates = req.body;

  // Clean up empty strings for optional fields
  Object.keys(updates).forEach(key => {
    if (updates[key] === '') {
      updates[key] = undefined; // Let Mongoose handle defaults
    }
  });

  // Handle nested objects (like address, visa, emergencyContacts)
  if (updates.address) {
    Object.keys(updates.address).forEach(key => {
      if (updates.address[key] === '') {
        updates.address[key] = undefined;
      }
    });
  }

  if (updates.visa) {
    Object.keys(updates.visa).forEach(key => {
      if (updates.visa[key] === '') {
        updates.visa[key] = undefined;
      }
    });
  }

  try {
    const updatedUser = await Employee.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!updatedUser) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400);
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    // Handle cast errors (like invalid date format)
    if (error.name === 'CastError') {
      res.status(400);
      throw new Error(`Invalid ${error.path}: ${error.value}`);
    }
    
    // Re-throw other errors
    throw error;
  }
});

// DELETE /employee/me
const deleteMe = asyncHandler(async (req, res) => {
  await Employee.findByIdAndDelete(req.user.id);
  res.status(200).json({ message: 'Account deleted successfully' });
});

module.exports = { getMe, updateMe, submitForm, deleteMe };