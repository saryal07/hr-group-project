const mongoose = require('mongoose');

const facilityReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
      maxLength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Report description is required'],
      trim: true,
      maxLength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved'],
      default: 'Open',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    category: {
      type: String,
      enum: [
        'Maintenance',
        'Safety',
        'Utilities',
        'Cleaning',
        'Security',
        'Other',
      ],
      required: [true, 'Category is required'],
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    housing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Housing',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FacilityComment',
      },
    ],
    attachments: [
      {
        filename: String,
        s3Key: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Update the updatedAt field before saving
facilityReportSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (this.status === 'Resolved' && !this.resolvedAt) {
    this.resolvedAt = Date.now();
  }
  next();
});

// Index for better query performance
facilityReportSchema.index({ reportedBy: 1, createdAt: -1 });
facilityReportSchema.index({ status: 1, priority: 1 });
facilityReportSchema.index({ housing: 1 });

module.exports = mongoose.model('FacilityReport', facilityReportSchema);
