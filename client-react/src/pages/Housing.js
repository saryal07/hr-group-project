import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Home,
  Person,
  Add,
  Report,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import axios from 'axios';
import CreateReportDialog from '../components/CreateReportDialog';

const Housing = () => {
  const navigate = useNavigate();
  const [housing, setHousing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    console.log('Loading housing data...');
    fetchHousingData();
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

  const handleReportCreated = (newReport) => {
    // Report created successfully, could refresh data or show success message
    console.log('New report created:', newReport);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
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

      <Grid container spacing={4}>
        {/* House Details - Left Side */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Home color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  House Details
                </Typography>
              </Box>

              {housing ? (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
                      Address
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {housing.address}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                    >
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
        </Grid>

        {/* Enhanced Facility Reports - Right Side */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Box display="flex" alignItems="center">
                  <Report color="primary" />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    Facility Reports
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setCreateDialogOpen(true)}
                >
                  Create New Report
                </Button>
              </Box>

              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Report and track facility issues in your housing. View all your
                reports, create new ones, and communicate with HR through our
                advanced reporting system.
              </Typography>

              {/* Quick Actions */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<DashboardIcon />}
                  onClick={() => navigate('/dashboard')}
                  sx={{ py: 1.5 }}
                >
                  View Facility Dashboard
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Report />}
                  onClick={() => navigate('/facility-reports')}
                  sx={{ py: 1.5 }}
                >
                  All Facility Reports
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Report Dialog */}
      <CreateReportDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleReportCreated}
      />
    </Container>
  );
};

export default Housing;
