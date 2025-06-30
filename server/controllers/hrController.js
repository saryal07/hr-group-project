const Housing = require('../models/Housing');
const Employee = require('../models/Employee');
const Document = require('../models/Document');
const TokenModel = require('../models/TokenModel');
const Invite = require('../models/Invite');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Create registration token
const createRegistrationToken = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await Employee.findOne({ email });
  if (user) {
    res.status(409);
    throw new Error('Email already registered');
  }

  // Generate token using JWT
  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '3h',
  });

  // Save token in DB (so it can be validated later)
  await TokenModel.create({
    email,
    token,
    used: false,
    expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
  });

   await Invite.create({
    email,
    name,
    token,
    registered: false,
  });

  res.status(200).json({
    email,
    name,
    token,
    message: 'Invitation sent'
  });

});

// Fetch registration invite history
const getInviteHistory = asyncHandler(async (req, res) => {
  try {
    const history = await Invite.find().sort({ createdAt: -1 }); // newest first
    res.json(history);
  } catch (err) {
    console.error('Error fetching invite history:', err);
    res.status(500).json({ message: 'Failed to retrieve invite history' });
  }
});

// GET housing
const getHousing = asyncHandler(async (req, res) => {
  const houses = await Housing.find().populate(
    'employees',
    'firstName lastName email cellPhone workPhone car preferredName middleName'
  );
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

// PUT housing by ID (RESTful approach)
const updateHousingById = asyncHandler(async (req, res) => {
  const houseId = req.params.id;
  const updates = req.body;

  if (!houseId) {
    res.status(400);
    throw new Error('House ID is required');
  }

  const updated = await Housing.findByIdAndUpdate(houseId, updates, {
    new: true,
    runValidators: true,
  }).populate(
    'employees',
    'firstName lastName email cellPhone workPhone car preferredName middleName'
  );

  if (!updated) {
    res.status(404);
    throw new Error('Housing not found');
  }

  console.log(`House updated: ${houseId}`);
  res.status(200).json(updated);
});

// DELETE housing
const deleteHousing = asyncHandler(async (req, res) => {
  const houseId = req.params.id;

  if (!houseId) {
    res.status(400);
    throw new Error('House ID is required');
  }

  // Check if house exists
  const house = await Housing.findById(houseId).populate('employees');

  if (!house) {
    res.status(404);
    throw new Error('House not found');
  }

  // Check if house has any employees assigned
  if (house.employees && house.employees.length > 0) {
    res.status(400);
    throw new Error(
      'Cannot delete house with assigned employees. Please reassign employees first.'
    );
  }

  // Delete the house
  await Housing.findByIdAndDelete(houseId);

  console.log(`House deleted: ${houseId}`);

  res.status(200).json({
    success: true,
    message: 'House deleted successfully',
  });
});

// GET onboarding status
const getOnboardingStatus = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.employeeId);
  if (!employee) throw new Error('Employee not found');
  res.json({ employee });
});

const getSpecificOnboarding = asyncHandler(async (req, res) => {
  const status = req.query.status;

  if (!status) {
    return res.status(400).json({ message: 'Status query is required' });
  }

  try {
    const employees = await Employee.find({ onboardingStatus: status });
    res.status(200).json(employees);
  } catch (err) {
    console.error('Error fetching onboarding applications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT onboarding status (HR approves or rejects applications, or resets status to allow resubmission)
const updateOnboardingStatus = asyncHandler(async (req, res) => {
  const { status, hrFeedback } = req.body;
  const employee = await Employee.findByIdAndUpdate(
    req.params.employeeId,
    {
      onboardingStatus: status,
      hrFeedback: hrFeedback,
    },
    { new: true }
  );

  if (!employee) throw new Error('Employee not found');

  res.json({
    message: 'Onboarding status updated',
    onboardingStatus: employee.onboardingStatus,
    hrFeedback: employee.hrFeedback,
  });
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
    data: documents,
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
    data: documents,
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
    data: documents,
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
    message: 'Document approved successfully',
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
    message: 'Document rejected successfully',
  });
});

// GET /hr/employees/opt - Get all employees with OPT visa status
const getOptEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({
    'visa.type': 'F1'
  }).select('firstName lastName email visa onboardingStatus');

  res.status(200).json({
    success: true,
    count: employees.length,
    data: employees,
  });
});

// GET /hr/workflow-summary - Get workflow summary for all OPT employees
const getWorkflowSummary = asyncHandler(async (req, res) => {
  // Get all OPT employees
  const optEmployees = await Employee.find({
    'visa.type': 'F1'
  }).select('firstName lastName email');

  const summary = await Promise.all(
    optEmployees.map(async (employee) => {
      const documents = await Document.find({ employee: employee._id }).sort({
        stepOrder: 1,
      });

      const workflowSteps = [
        { stepOrder: 1, documentType: 'opt_receipt', stepName: 'OPT Receipt' },
        { stepOrder: 2, documentType: 'opt_ead', stepName: 'OPT EAD' },
        { stepOrder: 3, documentType: 'i_983', stepName: 'I-983' },
        { stepOrder: 4, documentType: 'i_20', stepName: 'I-20' },
      ];

      const steps = workflowSteps.map((step) => {
        const document = documents.find(
          (doc) => doc.stepOrder === step.stepOrder
        );
        return {
          stepOrder: step.stepOrder,
          stepName: step.stepName,
          status: document ? document.status : 'not_uploaded',
          uploaded: !!document,
          uploadedAt: document ? document.uploadDate : null,
          reviewedAt: document ? document.reviewedAt : null,
        };
      });

      const completedSteps = steps.filter(
        (step) => step.status === 'approved'
      ).length;
      const totalSteps = steps.length;
      const progress = (completedSteps / totalSteps) * 100;

      return {
        employee: {
          id: employee._id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
        },
        steps,
        progress: Math.round(progress),
        completedSteps,
        totalSteps,
      };
    })
  );

  res.status(200).json({
    success: true,
    count: summary.length,
    data: summary,
  });
});

// GET /hr/employees - Get all employees with summary information
const getAllEmployees = asyncHandler(async (req, res) => {
  const { search } = req.query;
  
  let employees;
  
  if (search) {
    // Get all employees first, then filter by full name search
    const allEmployees = await Employee.find({})
      .select('firstName lastName middleName preferredName email cellPhone ssn visa onboardingStatus')
      .sort({ lastName: 1, firstName: 1 });
    
    // Create search regex for case-insensitive search
    const searchRegex = new RegExp(search, 'i');
    
    // Filter employees based on multiple criteria including full name
    employees = allEmployees.filter(emp => {
      const fullName = `${emp.firstName || ''} ${emp.middleName ? emp.middleName + ' ' : ''}${emp.lastName || ''}`.trim();
      const firstLastName = `${emp.firstName || ''} ${emp.lastName || ''}`.trim();
      
      return searchRegex.test(emp.firstName || '') ||
             searchRegex.test(emp.lastName || '') ||
             searchRegex.test(emp.preferredName || '') ||
             searchRegex.test(emp.email || '') ||
             searchRegex.test(fullName) ||
             searchRegex.test(firstLastName);
    });
  } else {
    // If no search, get all employees
    employees = await Employee.find({})
      .select('firstName lastName middleName preferredName email cellPhone ssn visa onboardingStatus')
      .sort({ lastName: 1, firstName: 1 });
  }

  // Format the response to match frontend requirements
  const formattedEmployees = employees.map(emp => ({
    id: emp._id,
    name: {
      first: emp.firstName || '',
      middle: emp.middleName || '',
      last: emp.lastName || '',
      preferred: emp.preferredName || ''
    },
    fullName: `${emp.firstName || ''} ${emp.middleName ? emp.middleName + ' ' : ''}${emp.lastName || ''}`.trim(),
    email: emp.email,
    phone: emp.cellPhone || '',
    ssn: emp.ssn || '',
    workAuthTitle: emp.visa?.title || 'Not specified',
    onboardingStatus: emp.onboardingStatus
  }));

  res.status(200).json({
    success: true,
    count: formattedEmployees.length,
    data: formattedEmployees
  });
});

// GET /hr/employees/:id - Get specific employee by ID with full profile
const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id)
    .select('-password'); // Exclude password from response

  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  // Format the response with complete employee information
  const formattedEmployee = {
    id: employee._id,
    personalInfo: {
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      middleName: employee.middleName || '',
      preferredName: employee.preferredName || '',
      email: employee.email,
      cellPhone: employee.cellPhone || '',
      workPhone: employee.workPhone || '',
      ssn: employee.ssn || '',
      dob: employee.dob || null,
      gender: employee.gender || ''
    },
    address: employee.address || {},
    citizenship: {
      isCitizen: employee.isCitizen,
      citizenshipStatus: employee.citizenshipStatus || '',
      visa: employee.visa || {}
    },
    driversLicense: {
      hasLicense: employee.hasLicense,
      number: employee.driversLicense?.number || '',
      expirationDate: employee.driversLicense?.expirationDate || null,
      licenseUrl: employee.driversLicense?.licenseUrl || ''
    },
    reference: employee.reference || {},
    emergencyContacts: employee.emergencyContacts || [],
    onboarding: {
      status: employee.onboardingStatus,
      hrFeedback: employee.hrFeedback || ''
    },
    account: {
      username: employee.username,
      role: employee.role,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt
    }
  };

  res.status(200).json({
    success: true,
    data: formattedEmployee
  });
});

// GET /hr/visa-status/in-progress - Get employees with pending OPT documents
const getInProgressOptEmployees = asyncHandler(async (req, res) => {
  // Get all OPT employees
  const optEmployees = await Employee.find({
    'visa.type': 'F1'
  }).select('firstName lastName email visa');

  const inProgressEmployees = await Promise.all(
    optEmployees.map(async (employee) => {
      const documents = await Document.find({ 
        employee: employee._id,
        documentType: { $in: ['opt_receipt', 'opt_ead', 'i_983', 'i_20'] }
      }).sort({ stepOrder: 1 });

      const workflowSteps = [
        { stepOrder: 1, documentType: 'opt_receipt', stepName: 'OPT Receipt' },
        { stepOrder: 2, documentType: 'opt_ead', stepName: 'OPT EAD' },
        { stepOrder: 3, documentType: 'i_983', stepName: 'I-983' },
        { stepOrder: 4, documentType: 'i_20', stepName: 'I-20' },
      ];

      // Find the current step and next step
      let currentStep = null;
      let nextStep = null;
      let pendingDocument = null;

      for (let i = 0; i < workflowSteps.length; i++) {
        const step = workflowSteps[i];
        const document = documents.find(doc => doc.stepOrder === step.stepOrder);
        
        if (!document) {
          // This step hasn't been uploaded yet
          nextStep = step;
          break;
        } else if (document.status === 'pending') {
          // This step is pending HR approval
          currentStep = step;
          pendingDocument = document;
          break;
        } else if (document.status === 'rejected') {
          // This step was rejected, employee needs to resubmit
          currentStep = step;
          nextStep = step;
          break;
        }
        // If approved, continue to next step
      }

      // Check if all documents are approved
      const allApproved = documents.length === 4 && 
        documents.every(doc => doc.status === 'approved');

      if (allApproved) {
        return null; // Not in progress
      }

      // Calculate days remaining
      const endDate = new Date(employee.visa.endDate);
      const today = new Date();
      const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

      // Determine next step message
      let nextStepMessage = '';
      let actionType = '';

      if (pendingDocument) {
        nextStepMessage = `Waiting for HR approval of ${currentStep.stepName}`;
        actionType = 'approve_reject';
      } else if (nextStep) {
        const stepMessages = {
          1: 'Please upload your OPT Receipt',
          2: 'Please upload your OPT EAD',
          3: 'Please download and fill out the I-983 form',
          4: 'Please upload your I-20'
        };
        nextStepMessage = stepMessages[nextStep.stepOrder];
        actionType = 'send_notification';
      }

      return {
        employee: {
          id: employee._id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          fullName: `${employee.firstName} ${employee.lastName}`
        },
        workAuthorization: {
          title: employee.visa.title,
          startDate: employee.visa.startDate,
          endDate: employee.visa.endDate,
          daysRemaining: daysRemaining > 0 ? daysRemaining : 0
        },
        nextStep: nextStepMessage,
        actionType,
        pendingDocument: pendingDocument ? {
          id: pendingDocument._id,
          fileName: pendingDocument.fileName,
          originalName: pendingDocument.originalName,
          uploadDate: pendingDocument.uploadDate,
          hrFeedback: pendingDocument.hrFeedback
        } : null,
        currentStep: currentStep ? currentStep.stepOrder : null
      };
    })
  );

  // Filter out null values (employees with all documents approved)
  const filteredEmployees = inProgressEmployees.filter(emp => emp !== null);

  res.status(200).json({
    success: true,
    count: filteredEmployees.length,
    data: filteredEmployees
  });
});

// GET /hr/visa-status/all - Get all OPT employees with their documents
const getAllOptEmployees = asyncHandler(async (req, res) => {
  const { search } = req.query;
  
  let optEmployees;
  
  if (search) {
    // Get all OPT employees first, then filter by search
    const allOptEmployees = await Employee.find({
      'visa.type': 'F1'
    }).select('firstName lastName middleName preferredName email visa');
    
    // Create search regex for case-insensitive search
    const searchRegex = new RegExp(search, 'i');
    
    // Filter employees based on multiple criteria
    optEmployees = allOptEmployees.filter(emp => {
      const fullName = `${emp.firstName || ''} ${emp.middleName ? emp.middleName + ' ' : ''}${emp.lastName || ''}`.trim();
      const firstLastName = `${emp.firstName || ''} ${emp.lastName || ''}`.trim();
      
      return searchRegex.test(emp.firstName || '') ||
             searchRegex.test(emp.lastName || '') ||
             searchRegex.test(emp.preferredName || '') ||
             searchRegex.test(emp.email || '') ||
             searchRegex.test(fullName) ||
             searchRegex.test(firstLastName);
    });
  } else {
    // If no search, get all OPT employees
    optEmployees = await Employee.find({
      'visa.type': 'F1'
    }).select('firstName lastName middleName preferredName email visa');
  }

  const employeesWithDocuments = await Promise.all(
    optEmployees.map(async (employee) => {
      const documents = await Document.find({ 
        employee: employee._id,
        documentType: { $in: ['opt_receipt', 'opt_ead', 'i_983', 'i_20'] }
      }).sort({ stepOrder: 1 });

      // Calculate days remaining
      const endDate = new Date(employee.visa.endDate);
      const today = new Date();
      const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

      // Get approved documents only
      const approvedDocuments = documents.filter(doc => doc.status === 'approved').map(doc => ({
        id: doc._id,
        fileName: doc.fileName,
        originalName: doc.originalName,
        documentType: doc.documentType,
        stepOrder: doc.stepOrder,
        uploadDate: doc.uploadDate,
        s3Key: doc.s3Key
      }));

      return {
        employee: {
          id: employee._id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          middleName: employee.middleName,
          preferredName: employee.preferredName,
          email: employee.email,
          fullName: `${employee.firstName} ${employee.middleName ? employee.middleName + ' ' : ''}${employee.lastName}`
        },
        workAuthorization: {
          title: employee.visa.title,
          startDate: employee.visa.startDate,
          endDate: employee.visa.endDate,
          daysRemaining: daysRemaining > 0 ? daysRemaining : 0
        },
        approvedDocuments
      };
    })
  );

  res.status(200).json({
    success: true,
    count: employeesWithDocuments.length,
    data: employeesWithDocuments
  });
});

// POST /hr/visa-status/send-notification - Send email notification to employee
const sendVisaNotification = asyncHandler(async (req, res) => {
  console.log('sendVisaNotification: Request received');
  console.log('sendVisaNotification: Request body:', req.body);
  
  const { employeeId, message } = req.body;

  if (!employeeId || !message) {
    console.log('sendVisaNotification: Missing required fields');
    res.status(400);
    throw new Error('Employee ID and message are required');
  }

  console.log('sendVisaNotification: Looking up employee:', employeeId);
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    console.log('sendVisaNotification: Employee not found');
    res.status(404);
    throw new Error('Employee not found');
  }

  console.log('sendVisaNotification: Employee found:', employee.email);

  try {
    // Import EmailService
    const EmailService = require('../services/emailService');
    
    // Get employee's full name
    const employeeName = `${employee.firstName} ${employee.lastName}`;
    
    // Calculate days remaining for context
    const endDate = new Date(employee.visa.endDate);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    console.log('sendVisaNotification: Calling EmailService.sendOptReminder');
    // Send email notification
    const emailResult = await EmailService.sendOptReminder(
      employee.email,
      employeeName,
      message,
      daysRemaining
    );

    console.log('sendVisaNotification: Email sent successfully');
    console.log(`Notification sent to ${employee.email}: ${message}`);

    res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      data: {
        employeeId,
        email: employee.email,
        employeeName,
        message,
        emailResult
      }
    });
  } catch (error) {
    console.error('sendVisaNotification: Error caught in controller:', error);
    console.error('sendVisaNotification: Error message:', error.message);
    console.error('sendVisaNotification: Error stack:', error.stack);
    
    res.status(500);
    throw new Error(`Failed to send notification: ${error.message}`);
  }
});

// GET /hr/documents/:id/preview - Get document preview URL
const getDocumentPreviewUrl = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);
  
  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }

  // Generate signed URL for preview
  const S3Service = require('../services/s3Service');
  const previewUrl = await S3Service.getSignedUrl(document.s3Key, 3600); // 1 hour expiry

  res.status(200).json({
    success: true,
    data: {
      previewUrl,
      fileName: document.fileName,
      originalName: document.originalName,
      documentType: document.documentType
    }
  });
});

module.exports = {
  createRegistrationToken,
  getInviteHistory,
  getHousing,
  createHousing,
  updateHousing,
  updateHousingById,
  deleteHousing,
  getOnboardingStatus,
  updateOnboardingStatus,
  getAllDocuments,
  getPendingDocuments,
  getEmployeeDocuments,
  approveDocument,
  rejectDocument,
  getOptEmployees,
  getWorkflowSummary,
  getSpecificOnboarding,
  getAllEmployees,
  getEmployeeById,
  getInProgressOptEmployees,
  getAllOptEmployees,
  sendVisaNotification,
  getDocumentPreviewUrl
};
