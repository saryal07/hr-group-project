import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Home,
  Person,
  Add,
  ExpandMore,
  Comment,
  Report
} from '@mui/icons-material';
import axios from 'axios';

const Housing = () => {
  const [housing, setHousing] = useState(null);
  const [facilityReports, setFacilityReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showCommentsDialog, setShowCommentsDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newReport, setNewReport] = useState({ title: '', description: '' });
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Using AuthContext for authentication
    console.log('Loading housing data...');
    
    fetchHousingData();
    fetchFacilityReports();
  }, []);

  const fetchHousingData = async () => {
    try {
      const response = await axios.get('/api/employee/housing/me');
      setHousing(response.data);
    } catch (error) {
      console.error('Failed to fetch housing data:', error);
      setError('Failed to fetch housing data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilityReports = async () => {
    try {
      const response = await axios.get('/api/employee/facility-reports/me');
      setFacilityReports(response.data || []);
    } catch (error) {
      console.error('Failed to fetch facility reports:', error);
    }
  };

  const handleCreateReport = async () => {
    if (!newReport.title || !newReport.description) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post('/api/employee/facility-reports', newReport);
      setNewReport({ title: '', description: '' });
      setShowReportDialog(false);
      fetchFacilityReports();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create report.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(`/api/employee/facility-reports/${selectedReport._id}/comments`, {
        description: newComment
      });
      setNewComment('');
      fetchFacilityReports(); // Refresh to get updated comments
    } catch (error) {
      setError('Failed to add comment.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'warning';
      case 'in_progress': return 'info';
      case 'closed': return 'success';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Housing Information
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* House Details */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Home color="primary" />
            <Typography variant="h6" sx={{ ml: 1 }}>
              House Details
            </Typography>
          </Box>
          
          {housing ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Address
                </Typography>
                <Typography variant="body1" paragraph>
                  {housing.address}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Roommates
                </Typography>
                {housing.roommates && housing.roommates.length > 0 ? (
                  <List dense>
                    {housing.roommates.map((roommate, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Person />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${roommate.firstName} ${roommate.lastName}`}
                          secondary={roommate.phone}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="textSecondary">
                    No roommates assigned
                  </Typography>
                )}
              </Grid>
            </Grid>
          ) : (
            <Typography color="textSecondary">
              No housing information available
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Facility Reports */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center">
              <Report color="primary" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Facility Reports
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowReportDialog(true)}
            >
              New Report
            </Button>
          </Box>

          {facilityReports.length > 0 ? (
            <div>
              {facilityReports.map((report) => (
                <Accordion key={report._id} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                      <Typography variant="subtitle1">{report.title}</Typography>
                      <Chip 
                        label={getStatusLabel(report.status)} 
                        color={getStatusColor(report.status)}
                        size="small"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Created: {new Date(report.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {report.description}
                      </Typography>
                      
                      {/* Comments */}
                      {report.comments && report.comments.length > 0 && (
                        <Box mt={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Comments ({report.comments.length})
                          </Typography>
                          {report.comments.map((comment, index) => (
                            <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <Typography variant="body2" color="textSecondary">
                                {comment.createdBy?.firstName} {comment.createdBy?.lastName} - {new Date(comment.timestamp).toLocaleString()}
                              </Typography>
                              <Typography variant="body2">
                                {comment.description}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                      
                      <Button
                        size="small"
                        startIcon={<Comment />}
                        onClick={() => {
                          setSelectedReport(report);
                          setShowCommentsDialog(true);
                        }}
                        sx={{ mt: 1 }}
                      >
                        Add Comment
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          ) : (
            <Typography color="textSecondary">
              No facility reports submitted
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Create Report Dialog */}
      <Dialog open={showReportDialog} onClose={() => setShowReportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Facility Report</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={newReport.title}
            onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newReport.description}
            onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateReport} variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={20} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Comment Dialog */}
      <Dialog open={showCommentsDialog} onClose={() => setShowCommentsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCommentsDialog(false)}>Cancel</Button>
          <Button onClick={handleAddComment} variant="contained">
            Add Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Housing; 