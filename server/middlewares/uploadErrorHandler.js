const multer = require('multer');

const uploadErrorHandler = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum file size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field. Please use "document" as the field name.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file is allowed per upload.'
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Handle S3-specific errors
  if (error.message.includes('S3 upload failed')) {
    return res.status(500).json({
      success: false,
      message: 'Failed to upload document to cloud storage. Please try again.'
    });
  }

  if (error.message.includes('S3 delete failed')) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete document from cloud storage. Please contact support.'
    });
  }

  if (error.message.includes('Failed to generate signed URL')) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate secure download link. Please try again.'
    });
  }

  next(error);
};

module.exports = uploadErrorHandler; 