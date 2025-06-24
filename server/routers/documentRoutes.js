const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middlewares/authMiddleware');
const uploadErrorHandler = require('../middlewares/uploadErrorHandler');
const S3Service = require('../services/s3Service');
const {
  uploadDocument,
  getDocuments,
  getWorkflowStatus,
  getDocument,
  deleteDocument
} = require('../controllers/documentController');

const router = express.Router();

// Create temporary uploads directory for multer (files are immediately uploaded to S3 and deleted)
const tempUploadsDir = path.join(__dirname, '../temp-uploads');
if (!fs.existsSync(tempUploadsDir)) {
  fs.mkdirSync(tempUploadsDir, { recursive: true });
}

// Create templates directory for I-983 templates (these are served locally)
const templatesDir = path.join(__dirname, '../templates');
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// Configure multer for temporary file storage only
// Files are uploaded to S3 and then immediately deleted from local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempUploadsDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter function - only allow specific file types
const fileFilter = (req, file, cb) => {
  // Allowed file types for OPT documents
  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, PNG, and JPG files are allowed.'), false);
  }
};

// Configure multer with strict limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only allow 1 file per request
  }
});

// Initialize S3 bucket on startup
S3Service.ensureBucketExists().catch(console.error);

// Document upload and retrieval routes
router
  .route('/')
  .post(protect, upload.single('document'), uploadErrorHandler, uploadDocument)
  .get(protect, getDocuments);

// Workflow status endpoint
router.get('/status', protect, getWorkflowStatus);

// I-983 template download endpoints (served locally)
router.get('/templates/i983-empty', protect, (req, res) => {
  const templatePath = path.join(templatesDir, 'i983-empty-template.pdf');
  
  if (!fs.existsSync(templatePath)) {
    res.status(404).json({
      success: false,
      message: 'I-983 Empty Template not found. Please contact HR to upload the template.'
    });
    return;
  }
  
  res.download(templatePath, 'i983-empty-template.pdf');
});

router.get('/templates/i983-sample', protect, (req, res) => {
  const templatePath = path.join(templatesDir, 'i983-sample-template.pdf');
  
  if (!fs.existsSync(templatePath)) {
    res.status(404).json({
      success: false,
      message: 'I-983 Sample Template not found. Please contact HR to upload the template.'
    });
    return;
  }
  
  res.download(templatePath, 'i983-sample-template.pdf');
});

// Individual document routes
router
  .route('/:id')
  .get(protect, getDocument)
  .delete(protect, deleteDocument);

module.exports = router; 