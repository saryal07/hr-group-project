const mongoose = require('mongoose');

const facilityCommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      maxLength: [500, 'Comment cannot exceed 500 characters'],
    },
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    facilityReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FacilityReport',
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FacilityComment',
      default: null,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FacilityComment',
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
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
  },
  {
    timestamps: true,
  }
);

// Update the updatedAt field and set edit flags before saving
facilityCommentSchema.pre('save', function (next) {
  if (this.isModified('comment') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = Date.now();
  }
  this.updatedAt = Date.now();
  next();
});

// When a comment is saved, add it to parent's replies if it's a reply
facilityCommentSchema.post('save', async function (doc) {
  if (doc.parentComment) {
    await mongoose
      .model('FacilityComment')
      .findByIdAndUpdate(doc.parentComment, {
        $addToSet: { replies: doc._id },
      });
  }
});

// Index for better query performance
facilityCommentSchema.index({ facilityReport: 1, createdAt: 1 });
facilityCommentSchema.index({ commentedBy: 1 });
facilityCommentSchema.index({ parentComment: 1 });

module.exports = mongoose.model('FacilityComment', facilityCommentSchema);
