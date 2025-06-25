const Housing = require('../models/Housing');
const Employee = require('../models/Employee');
const Document = require('../models/Document');
const TokenModel = require('../models/TokenModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { sendRegistrationEmail } = require('../services/emailService');

// Create registration token
const createRegistrationToken = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const emailExists = await Employee.findOne({ email });
  if (emailExists) {
    res.status(409);
    throw new Error('Email already registered');
  }

  // Generate token using JWT
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '3h' });

  // Save token in DB (so it can be validated later)
  await TokenModel.create({
    email,
    token,
    used: false,
    expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
  });

  // Send email
  const registrationLink = `https://localhost:3000/register/${token}`;
  //await sendRegistrationEmail(email, registrationLink);  // Send registration link to email

  res.status(200).json({ token, message: 'Invitation sent' });
});

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

// GET /hr/documents - Get all documents for HR review
const getAllDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({})
    .populate('employee', 'firstName lastName email')
    .populate('reviewedBy', 'firstName lastName')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: documents.length,
    data: documents
  });
});

// GET /hr/documents/pending - Get only pending documents
const getPendingDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({ status: 'pending' })
    .populate('employee', 'firstName lastName email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: documents.length,
    data: documents
  });
});

// GET /hr/documents/employee/:employeeId - Get documents for specific employee
const getEmployeeDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({ employee: req.params.employeeId })
    .populate('employee', 'firstName lastName email')
    .populate('reviewedBy', 'firstName lastName')
    .sort({ stepOrder: 1 });

  if (documents.length === 0) {
    res.status(404);
    throw new Error('No documents found for this employee');
  }

  res.status(200).json({
    success: true,
    count: documents.length,
    data: documents
  });
});

// PUT /hr/documents/:id/approve - Approve a document
const approveDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }

  if (document.status !== 'pending') {
    res.status(400);
    throw new Error('Document is not in pending status');
  }

  document.status = 'approved';
  document.reviewedBy = req.user.id;
  document.reviewedAt = new Date();
  document.hrFeedback = req.body.feedback || '';

  await document.save();

  res.status(200).json({
    success: true,
    data: document,
    message: 'Document approved successfully'
  });
});

// PUT /hr/documents/:id/reject - Reject a document
const rejectDocument = asyncHandler(async (req, res) => {
  const { feedback } = req.body;

  if (!feedback) {
    res.status(400);
    throw new Error('Feedback is required when rejecting a document');
  }

  const document = await Document.findById(req.params.id);

  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }

  if (document.status !== 'pending') {
    res.status(400);
    throw new Error('Document is not in pending status');
  }

  document.status = 'rejected';
  document.reviewedBy = req.user.id;
  document.reviewedAt = new Date();
  document.hrFeedback = feedback;

  await document.save();

  res.status(200).json({
    success: true,
    data: document,
    message: 'Document rejected successfully'
  });
});

// GET /hr/employees/opt - Get all employees with OPT visa status
const getOptEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({
    'visa.title': 'OPT'
  }).select('firstName lastName email visa onboardingStatus');

  res.status(200).json({
    success: true,
    count: employees.length,
    data: employees
  });
});

// GET /hr/workflow-summary - Get workflow summary for all OPT employees
const getWorkflowSummary = asyncHandler(async (req, res) => {
  // Get all OPT employees
  const optEmployees = await Employee.find({
    'visa.title': 'OPT'
  }).select('firstName lastName email');

  const summary = await Promise.all(
    optEmployees.map(async (employee) => {
      const documents = await Document.find({ employee: employee._id })
        .sort({ stepOrder: 1 });

      const workflowSteps = [
        { stepOrder: 1, documentType: 'opt_receipt', stepName: 'OPT Receipt' },
        { stepOrder: 2, documentType: 'opt_ead', stepName: 'OPT EAD' },
        { stepOrder: 3, documentType: 'i_983', stepName: 'I-983' },
        { stepOrder: 4, documentType: 'i_20', stepName: 'I-20' }
      ];

      const steps = workflowSteps.map(step => {
        const document = documents.find(doc => doc.stepOrder === step.stepOrder);
        return {
          stepOrder: step.stepOrder,
          stepName: step.stepName,
          status: document ? document.status : 'not_uploaded',
          uploaded: !!document,
          uploadedAt: document ? document.uploadDate : null,
          reviewedAt: document ? document.reviewedAt : null
        };
      });

      const completedSteps = steps.filter(step => step.status === 'approved').length;
      const totalSteps = steps.length;
      const progress = (completedSteps / totalSteps) * 100;

      return {
        employee: {
          id: employee._id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email
        },
        steps,
        progress: Math.round(progress),
        completedSteps,
        totalSteps
      };
    })
  );

  res.status(200).json({
    success: true,
    count: summary.length,
    data: summary
  });
});

module.exports = {
  createRegistrationToken,
  getHousing,
  createHousing,
  updateHousing,
  getOnboardingStatus,
  updateOnboardingStatus,
  getAllDocuments,
  getPendingDocuments,
  getEmployeeDocuments,
  approveDocument,
  rejectDocument,
  getOptEmployees,
  getWorkflowSummary
};