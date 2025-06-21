const Housing = require('../models/Housing');
const Employee = require('../models/Employee');
const asyncHandler = require('express-async-handler');

// GET housing
const getHousing = asyncHandler(async (req, res) => {
  const houses = await Housing.find().populate('employees', 'firstName lastName email');
  res.json(houses);
});

// POST housing
const createHousing = asyncHandler(async (req, res) => {
  const newHouse = await Housing.create(req.body);
  res.status(201).json(newHouse);
});

// PUT housing (for example, updating a specific house)
const updateHousing = asyncHandler(async (req, res) => {
  const { id, ...updates } = req.body;
  const updated = await Housing.findByIdAndUpdate(id, updates, { new: true });
  if (!updated) {
    res.status(404);
    throw new Error('Housing not found');
  }
  res.json(updated);
});

// GET onboarding status
const getOnboardingStatus = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.employeeId);
  if (!employee) throw new Error('Employee not found');
  res.json({ onboardingStatus: employee.onboardingStatus });
});

// PUT onboarding status (HR approves or rejects applications, or resets status to allow resubmission)
const updateOnboardingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const employee = await Employee.findByIdAndUpdate(req.params.employeeId, {
    onboardingStatus: status
  }, { new: true });

  if (!employee) throw new Error('Employee not found');
  res.json({ message: 'Onboarding status updated', onboardingStatus: employee.onboardingStatus });
});

module.exports = {
  getHousing,
  createHousing,
  updateHousing,
  getOnboardingStatus,
  updateOnboardingStatus
};