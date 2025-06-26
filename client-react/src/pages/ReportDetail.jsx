import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Box,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  // Edit comment states
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [updatingComment, setUpdatingComment] = useState(false);

  // Fetch report details
  const fetchReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/employee/facility-reports/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReport(data.data);
      } else if (response.status === 404) {
        setError('Report not found');
      } else {
        setError('Failed to fetch report');
      }
    } catch (error) {
      setError('Error fetching report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setAddingComment(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/employee/facility-reports/${id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment: newComment }),
        }
      );

      if (response.ok) {
        setNewComment('');
        fetchReport(); // Refresh to get the new comment
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add comment');
      }
    } catch (error) {
      setError('Error adding comment: ' + error.message);
    } finally {
      setAddingComment(false);
    }
  };

  // Start editing a comment
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.comment);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  };

  // Update comment
  const handleUpdateComment = async (commentId) => {
    if (!editCommentText.trim()) return;

    try {
      setUpdatingComment(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `/api/employee/facility-reports/${id}/comments/${commentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment: editCommentText }),
        }
      );

      if (response.ok) {
        setEditingCommentId(null);
        setEditCommentText('');
        fetchReport(); // Refresh to get the updated comment
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update comment');
      }
    } catch (error) {
      setError('Error updating comment: ' + error.message);
    } finally {
      setUpdatingComment(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading report...
        </Typography>
      </Container>
    );
  }

  if (error && !report) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          onClick={() => navigate('/employee/facility-reports')}
          sx={{ mt: 2 }}
        >
          Back to Reports
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton
          onClick={() => navigate('/employee/facility-reports')}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Report Details
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Report Information */}
        <Grid item xs={12} md={8}>
          <Card sx={{ border: '1px solid #e0e0e0' }}>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 3,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', flex: 1 }}>
                  {report?.title}
                </Typography>
                <Chip label={report?.status} color="default" sx={{ ml: 2 }} />
              </Box>

              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
                {report?.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="textSecondary">
                    Category
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {report?.category}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="textSecondary">
                    Priority
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {report?.priority}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="textSecondary">
                    Created
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {new Date(report?.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="textSecondary">
                    Reported By
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {report?.reportedBy?.username}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Comments Section */}
        <Grid item xs={12} md={4}>
          <Card sx={{ border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Comments ({report?.comments?.length || 0})
              </Typography>

              {/* Add Comment */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  endIcon={
                    addingComment ? (
                      <CircularProgress size={20} />
                    ) : (
                      <SendIcon />
                    )
                  }
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || addingComment}
                  sx={{
                    backgroundColor: '#000000',
                    color: 'white',
                    '&:hover': { backgroundColor: '#333333' },
                  }}
                >
                  {addingComment ? 'Adding...' : 'Add Comment'}
                </Button>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Comments List */}
              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {report?.comments && report.comments.length > 0 ? (
                  report.comments.map((comment) => (
                    <Box
                      key={comment._id}
                      sx={{
                        mb: 3,
                        p: 2,
                        backgroundColor: '#f9f9f9',
                        borderRadius: 1,
                      }}
                    >
                      {/* Edit Mode */}
                      {editingCommentId === comment._id ? (
                        <Box>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            variant="outlined"
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            sx={{ mb: 2 }}
                          />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={
                                updatingComment ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  <SaveIcon />
                                )
                              }
                              onClick={() => handleUpdateComment(comment._id)}
                              disabled={
                                !editCommentText.trim() || updatingComment
                              }
                              sx={{
                                backgroundColor: '#000000',
                                color: 'white',
                                '&:hover': { backgroundColor: '#333333' },
                              }}
                            >
                              {updatingComment ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<CancelIcon />}
                              onClick={handleCancelEdit}
                              sx={{
                                borderColor: '#000000',
                                color: '#000000',
                                '&:hover': { borderColor: '#333333' },
                              }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        /* Display Mode */
                        <>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {comment.comment}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Box>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                {comment.commentedBy?.username ||
                                  'Unknown User'}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                                sx={{ ml: 2 }}
                              >
                                {new Date(
                                  comment.createdAt
                                ).toLocaleDateString()}
                              </Typography>
                            </Box>
                            {/* Only show edit button for user's own comments */}
                            {comment.commentedBy?.username ===
                              report?.reportedBy?.username && (
                              <IconButton
                                size="small"
                                onClick={() => handleStartEdit(comment)}
                                sx={{ color: '#666666' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ textAlign: 'center', py: 4 }}
                  >
                    No comments yet. Be the first to comment!
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReportDetail;
