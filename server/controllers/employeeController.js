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

// PUT /employee/me
const updateMe = asyncHandler(async (req, res) => {
  const updates = req.body;

  // we could run our own server-side input validation here

  const updatedUser = await Employee.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true
  }).select('-password');

  if (!updatedUser) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json(updatedUser);
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

// DELETE /employee/me
const deleteMe = asyncHandler(async (req, res) => {
  await Employee.findByIdAndDelete(req.user.id);
  res.status(200).json({ message: 'Account deleted successfully' });
});

module.exports = { getMe, updateMe, submitForm, deleteMe };