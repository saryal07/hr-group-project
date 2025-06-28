const Employee = require('../models/Employee');
const Housing = require('../models/Housing');
const FacilityReport = require('../models/FacilityReport');
const asyncHandler = require('express-async-handler');

// GET /employee/housing/me - Get employee's assigned housing
const getMyHousing = asyncHandler(async (req, res) => {
  const housing = await Housing.findOne({ 
    employees: req.user.id 
  }).populate('employees', 'firstName lastName middleName preferredName cellPhone');

  if (!housing) {
    res.status(404);
    throw new Error('No housing assignment found for this employee');
  }

  // Format response to match frontend expectations
  const roommates = housing.employees
    .filter(emp => emp._id.toString() !== req.user.id) // Exclude current user
    .map(emp => ({
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      middleName: emp.middleName || '',
      preferredName: emp.preferredName || '',
      phone: emp.cellPhone || ''
    }));

  const response = {
    address: housing.address,
    roommates: roommates,
    landlord: housing.landlord,
    facility: housing.facility
  };

  res.status(200).json(response);
});

// GET /employee/facility-reports/me - Get employee's facility reports
const getMyFacilityReports = asyncHandler(async (req, res) => {
  const reports = await FacilityReport.find({ 
    employee: req.user.id 
  }).populate('employee', 'firstName lastName')
    .populate('comments.createdBy', 'firstName lastName')
    .sort({ createdAt: -1 });

  res.status(200).json(reports);
});

// POST /employee/facility-reports - Create a new facility report
const createFacilityReport = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error('Title and description are required');
  }

  const report = await FacilityReport.create({
    title,
    description,
    employee: req.user.id
  });

  const populatedReport = await FacilityReport.findById(report._id)
    .populate('employee', 'firstName lastName');

  res.status(201).json(populatedReport);
});

// POST /employee/facility-reports/:id/comments - Add comment to facility report
const addCommentToReport = asyncHandler(async (req, res) => {
  const { description } = req.body;
  const { id } = req.params;

  if (!description) {
    res.status(400);
    throw new Error('Comment description is required');
  }

  const report = await FacilityReport.findById(id);

  if (!report) {
    res.status(404);
    throw new Error('Facility report not found');
  }

  // Only the report creator can add comments
  if (report.employee.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to comment on this report');
  }

  report.comments.push({
    description,
    createdBy: req.user.id
  });

  await report.save();

  const updatedReport = await FacilityReport.findById(id)
    .populate('employee', 'firstName lastName')
    .populate('comments.createdBy', 'firstName lastName');

  res.status(200).json(updatedReport);
});

module.exports = { 
  getMyHousing, 
  getMyFacilityReports, 
  createFacilityReport, 
  addCommentToReport 
}; 