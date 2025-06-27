const asyncHandler = require('express-async-handler');
const FacilityReport = require('../models/FacilityReport');
const FacilityComment = require('../models/FacilityComment');

// @desc    Create a new facility report
// @route   POST /api/employee/facility-reports
// @access  Private (Employee)
const createFacilityReport = asyncHandler(async (req, res) => {
  const { title, description, category, priority, housing } = req.body;

  // Validate required fields
  if (!title || !description || !category) {
    res.status(400);
    throw new Error('Title, description, and category are required');
  }

  const facilityReport = await FacilityReport.create({
    title,
    description,
    category,
    priority: priority || 'Medium',
    reportedBy: req.user._id,
    housing: housing || null,
  });

  // Populate the reportedBy field for response
  await facilityReport.populate('reportedBy', 'username email');

  res.status(201).json({
    success: true,
    message: 'Facility report created successfully',
    data: facilityReport,
  });
});

// @desc    Get all facility reports for the logged-in user
// @route   GET /api/employee/facility-reports
// @access  Private (Employee)
const getFacilityReports = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;
  const category = req.query.category;
  const priority = req.query.priority;

  // Build filter object
  const filter = { reportedBy: req.user._id };
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;

  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Get reports with pagination
  const facilityReports = await FacilityReport.find(filter)
    .populate('reportedBy', 'username email')
    .populate('housing', 'address landlord')
    .populate({
      path: 'comments',
      populate: {
        path: 'commentedBy',
        select: 'username email',
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const totalReports = await FacilityReport.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: facilityReports,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalReports / limit),
      totalReports,
      hasNext: page < Math.ceil(totalReports / limit),
      hasPrev: page > 1,
    },
  });
});

// @desc    Get a specific facility report
// @route   GET /api/employee/facility-reports/:id
// @access  Private (Employee)
const getFacilityReport = asyncHandler(async (req, res) => {
  const facilityReport = await FacilityReport.findById(req.params.id)
    .populate('reportedBy', 'username email')
    .populate('housing', 'address landlord')
    .populate({
      path: 'comments',
      populate: {
        path: 'commentedBy',
        select: 'username email',
      },
      options: { sort: { createdAt: 1 } },
    });

  if (!facilityReport) {
    res.status(404);
    throw new Error('Facility report not found');
  }

  // Check if user owns this report or is admin
  if (
    facilityReport.reportedBy._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to view this report');
  }

  res.status(200).json({
    success: true,
    data: facilityReport,
  });
});

// @desc    Update a facility report
// @route   PUT /api/employee/facility-reports/:id
// @access  Private (Employee)
const updateFacilityReport = asyncHandler(async (req, res) => {
  const { title, description, category, priority, status } = req.body;

  const facilityReport = await FacilityReport.findById(req.params.id);

  if (!facilityReport) {
    res.status(404);
    throw new Error('Facility report not found');
  }

  // Check if user owns this report or is admin
  if (
    facilityReport.reportedBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to update this report');
  }

  // Update fields
  if (title) facilityReport.title = title;
  if (description) facilityReport.description = description;
  if (category) facilityReport.category = category;
  if (priority) facilityReport.priority = priority;
  if (status && req.user.role === 'admin') facilityReport.status = status; // Only admin can change status

  await facilityReport.save();

  // Populate for response
  await facilityReport.populate('reportedBy', 'username email');

  res.status(200).json({
    success: true,
    message: 'Facility report updated successfully',
    data: facilityReport,
  });
});

// @desc    Delete a facility report
// @route   DELETE /api/employee/facility-reports/:id
// @access  Private (Employee/Admin)
const deleteFacilityReport = asyncHandler(async (req, res) => {
  const facilityReport = await FacilityReport.findById(req.params.id);

  if (!facilityReport) {
    res.status(404);
    throw new Error('Facility report not found');
  }

  // Check if user owns this report or is admin
  if (
    facilityReport.reportedBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this report');
  }

  // Delete all associated comments
  await FacilityComment.deleteMany({ facilityReport: req.params.id });

  // Delete the report
  await FacilityReport.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Facility report deleted successfully',
  });
});

// @desc    Add a comment to a facility report
// @route   POST /api/employee/facility-reports/:id/comments
// @access  Private (Employee)
const addComment = asyncHandler(async (req, res) => {
  const { comment, parentComment } = req.body;

  if (!comment) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  // Check if the facility report exists
  const facilityReport = await FacilityReport.findById(req.params.id);
  if (!facilityReport) {
    res.status(404);
    throw new Error('Facility report not found');
  }

  // Create the comment
  const newComment = await FacilityComment.create({
    comment,
    commentedBy: req.user._id,
    facilityReport: req.params.id,
    parentComment: parentComment || null,
  });

  // Add comment to facility report
  facilityReport.comments.push(newComment._id);
  await facilityReport.save();

  // Populate the comment for response
  await newComment.populate('commentedBy', 'username email');

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: newComment,
  });
});

// @desc    Update a comment
// @route   PUT /api/employee/facility-reports/:reportId/comments/:commentId
// @access  Private (Employee)
const updateComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  if (!comment) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  const existingComment = await FacilityComment.findById(req.params.commentId);

  if (!existingComment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user owns this comment
  if (existingComment.commentedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this comment');
  }

  existingComment.comment = comment;
  await existingComment.save();

  // Populate for response
  await existingComment.populate('commentedBy', 'username email');

  res.status(200).json({
    success: true,
    message: 'Comment updated successfully',
    data: existingComment,
  });
});

// @desc    Delete a comment
// @route   DELETE /api/employee/facility-reports/:reportId/comments/:commentId
// @access  Private (Employee)
const deleteComment = asyncHandler(async (req, res) => {
  const existingComment = await FacilityComment.findById(req.params.commentId);

  if (!existingComment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user owns this comment or is admin
  if (
    existingComment.commentedBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  // Remove comment from facility report
  await FacilityReport.findByIdAndUpdate(req.params.reportId, {
    $pull: { comments: req.params.commentId },
  });

  // Delete the comment and its replies
  await FacilityComment.deleteMany({
    $or: [
      { _id: req.params.commentId },
      { parentComment: req.params.commentId },
    ],
  });

  res.status(200).json({
    success: true,
    message: 'Comment deleted successfully',
  });
});

module.exports = {
  createFacilityReport,
  getFacilityReports,
  getFacilityReport,
  updateFacilityReport,
  deleteFacilityReport,
  addComment,
  updateComment,
  deleteComment,
};
