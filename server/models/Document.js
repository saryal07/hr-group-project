const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  
  fileName: {
    type: String,
    required: true
  },
  
  originalName: {
    type: String,
    required: true
  },
  
  fileType: {
    type: String,
    required: true,
    enum: ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
  },
  
  fileSize: {
    type: Number,
    required: true
  },
  
  // S3 storage fields
  s3Key: {
    type: String,
    required: true
  },
  
  s3Bucket: {
    type: String,
    required: true
  },
  
  s3Url: {
    type: String,
    required: true
  },
  
  documentType: {
    type: String,
    required: true,
    enum: ['opt_receipt', 'opt_ead', 'i_983', 'i_20', 'profile_picture', 'drivers_license']
  },
  
  description: {
    type: String,
    maxlength: 500
  },
  
  uploadDate: {
    type: Date,
    default: Date.now
  },
  
  // New fields for OPT workflow
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  hrFeedback: {
    type: String,
    maxlength: 1000
  },
  
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee' // HR employee who reviewed
  },
  
  reviewedAt: {
    type: Date
  },
  
  // Step order for OPT workflow (1-4) - only required for OPT documents
  stepOrder: {
    type: Number,
    enum: [1, 2, 3, 4], // 1: opt_receipt, 2: opt_ead, 3: i_983, 4: i_20
    required: function() {
      // Only required for OPT workflow documents
      return ['opt_receipt', 'opt_ead', 'i_983', 'i_20'].includes(this.documentType);
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
documentSchema.index({ employee: 1, documentType: 1 });
documentSchema.index({ employee: 1, stepOrder: 1 });
documentSchema.index({ uploadDate: -1 });
documentSchema.index({ status: 1 });

// Virtual for step mapping
documentSchema.virtual('stepName').get(function() {
  const stepMap = {
    1: 'OPT Receipt',
    2: 'OPT EAD',
    3: 'I-983',
    4: 'I-20'
  };
  return stepMap[this.stepOrder] || 'Unknown';
});

// Virtual for document category
documentSchema.virtual('category').get(function() {
  const optDocuments = ['opt_receipt', 'opt_ead', 'i_983', 'i_20'];
  const personalDocuments = ['profile_picture', 'drivers_license'];
  
  if (optDocuments.includes(this.documentType)) {
    return 'opt_workflow';
  } else if (personalDocuments.includes(this.documentType)) {
    return 'personal';
  }
  return 'other';
});

// Virtual for download URL (will be populated with signed URL when needed)
documentSchema.virtual('downloadUrl').get(function() {
  return this.s3Url; // This will be replaced with signed URL when needed
});

// Ensure virtuals are serialized
documentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Document', documentSchema); 