const Document = require('../models/Document');
const asyncHandler = require('express-async-handler');
const S3Service = require('../services/s3Service');

// Helper function to get step order for document type
const getStepOrder = (documentType) => {
  const stepMap = {
    'opt_receipt': 1,
    'opt_ead': 2,
    'i_983': 3,
    'i_20': 4
  };
  return stepMap[documentType];
};

// Helper function to check if document type requires workflow
const requiresWorkflow = (documentType) => {
  const workflowTypes = ['opt_receipt', 'opt_ead', 'i_983', 'i_20'];
  return workflowTypes.includes(documentType);
};

// Helper function to check if previous step is approved
const checkPreviousStepApproved = async (employeeId, currentStep) => {
  if (currentStep === 1) return true; // First step always allowed
  
  const previousStep = currentStep - 1;
  const previousDocument = await Document.findOne({
    employee: employeeId,
    stepOrder: previousStep
  });
  
  return previousDocument && previousDocument.status === 'approved';
};

// POST /documents - Upload a document
const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const { documentType, description } = req.body;

  if (!documentType) {
    res.status(400);
    throw new Error('Document type is required');
  }

  // Validate document type
  const validTypes = ['opt_receipt', 'opt_ead', 'i_983', 'i_20', 'profile_picture', 'drivers_license'];
  if (!validTypes.includes(documentType)) {
    res.status(400);
    throw new Error('Invalid document type');
  }

  // Check if document of this type already exists for this user
  const existingDocument = await Document.findOne({
    employee: req.user.id,
    documentType: documentType
  });

   // Delete existing document if present
  if (existingDocument) {
    console.log(`🔁 Replacing existing document: ${existingDocument._id}`);
    await S3Service.deleteFile(existingDocument.s3Key);
    await existingDocument.deleteOne();
  }

  // Handle workflow documents (OPT documents)
  if (requiresWorkflow(documentType)) {
    const stepOrder = getStepOrder(documentType);
    
    // Check if previous step is approved
    const previousStepApproved = await checkPreviousStepApproved(req.user.id, stepOrder);
    if (!previousStepApproved) {
      res.status(400);
      throw new Error(`Previous step must be approved before uploading ${documentType}`);
    }
  }

  try {
    // Upload file to S3
    const s3Result = await S3Service.uploadFile(req.file, req.user.id, documentType);

    // Determine initial status based on document type
    const initialStatus = requiresWorkflow(documentType) ? 'pending' : 'approved';

    const documentData = {
      employee: req.user.id,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      s3Key: s3Result.key,
      s3Bucket: s3Result.bucket,
      s3Url: s3Result.url,
      documentType,
      description: description || '',
      status: initialStatus
    };

    // Add stepOrder only for workflow documents
    if (requiresWorkflow(documentType)) {
      documentData.stepOrder = getStepOrder(documentType);
    }

    const document = await Document.create(documentData);

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Upload failed: ${error.message}`);
  }
});

// GET /documents - Get all documents for the authenticated employee
const getDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({ employee: req.user.id })
    .sort({ stepOrder: 1, uploadDate: -1 });

  // Generate signed URLs for each document
  const documentsWithUrls = await Promise.all(
    documents.map(async (doc) => {
      try {
        const signedUrl = await S3Service.getSignedUrl(doc.s3Key, 3600); // 1 hour expiry
        const docObj = doc.toObject();
        docObj.downloadUrl = signedUrl;
        return docObj;
      } catch (error) {
        console.error(`Failed to generate signed URL for document ${doc._id}:`, error);
        const docObj = doc.toObject();
        docObj.downloadUrl = null;
        return docObj;
      }
    })
  );

  res.status(200).json({
    success: true,
    count: documentsWithUrls.length,
    data: documentsWithUrls
  });
});

// GET /documents/status - Get OPT workflow status
const getWorkflowStatus = asyncHandler(async (req, res) => {
  const documents = await Document.find({ employee: req.user.id })
    .sort({ stepOrder: 1 });

  // Create workflow status for all 4 steps
  const workflowSteps = [
    { stepOrder: 1, documentType: 'opt_receipt', stepName: 'OPT Receipt' },
    { stepOrder: 2, documentType: 'opt_ead', stepName: 'OPT EAD' },
    { stepOrder: 3, documentType: 'i_983', stepName: 'I-983' },
    { stepOrder: 4, documentType: 'i_20', stepName: 'I-20' }
  ];

  const status = await Promise.all(
    workflowSteps.map(async (step) => {
      const document = documents.find(doc => doc.stepOrder === step.stepOrder);
      
      if (!document) {
        // Check if previous step is approved to determine if this step is available
        const previousDocument = documents.find(doc => doc.stepOrder === step.stepOrder - 1);
        const canUpload = step.stepOrder === 1 || (previousDocument && previousDocument.status === 'approved');
        
        return {
          stepOrder: step.stepOrder,
          documentType: step.documentType,
          stepName: step.stepName,
          status: 'not_uploaded',
          canUpload,
          message: canUpload ? `Please upload your ${step.stepName}` : 'Previous step must be approved first'
        };
      }

      let message = '';
      switch (document.status) {
        case 'pending':
          message = `Waiting for HR to approve your ${step.stepName}`;
          break;
        case 'approved':
          if (step.stepOrder === 1) {
            message = 'Please upload a copy of your OPT EAD';
          } else if (step.stepOrder === 2) {
            message = 'Please download and fill out the I-983 form';
          } else if (step.stepOrder === 3) {
            message = 'Please send the I-983 along with all necessary documents to your school and upload the new I-20';
          } else if (step.stepOrder === 4) {
            message = 'All documents have been approved';
          }
          break;
        case 'rejected':
          message = document.hrFeedback || 'Document was rejected by HR';
          break;
      }

      // Generate signed URL for the document
      let downloadUrl = null;
      try {
        downloadUrl = await S3Service.getSignedUrl(document.s3Key, 3600);
      } catch (error) {
        console.error(`Failed to generate signed URL for document ${document._id}:`, error);
      }

      return {
        stepOrder: step.stepOrder,
        documentType: step.documentType,
        stepName: step.stepName,
        status: document.status,
        document: {
          ...document.toObject(),
          downloadUrl
        },
        message,
        canUpload: false // Already uploaded
      };
    })
  );

  res.status(200).json({
    success: true,
    data: status
  });
});

// GET /documents/:id - Get a specific document
const getDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }

  // Check if the document belongs to the authenticated user
  if (document.employee.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to access this document');
  }

  // Generate signed URL for download
  let downloadUrl = null;
  try {
    downloadUrl = await S3Service.getSignedUrl(document.s3Key, 3600);
  } catch (error) {
    console.error(`Failed to generate signed URL for document ${document._id}:`, error);
  }

  const documentWithUrl = document.toObject();
  documentWithUrl.downloadUrl = downloadUrl;

  res.status(200).json({
    success: true,
    data: documentWithUrl
  });
});

// DELETE /documents/:id - Delete a document
const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    res.status(404);
    throw new Error('Document not found');
  }

  // Check if the document belongs to the authenticated user
  if (document.employee.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to delete this document');
  }

  // For workflow documents, check if document is pending or approved (can't delete if rejected)
  if (requiresWorkflow(document.documentType) && document.status === 'rejected') {
    res.status(400);
    throw new Error('Cannot delete a rejected document');
  }

  try {
    // Delete file from S3
    await S3Service.deleteFile(document.s3Key);
    
    // Delete document from database
    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Failed to delete document: ${error.message}`);
  }
});

module.exports = {
  uploadDocument,
  getDocuments,
  getWorkflowStatus,
  getDocument,
  deleteDocument
}; 