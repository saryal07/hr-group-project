// This is a placeholder to test facility reports
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Housing = () => {
  const navigate = useNavigate();
  const [housingInfo, setHousingInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Just for now using placeholder data
    // In full implementation, this would fetch from the actual housing API
    setHousingInfo({
      address: '123 Main St, Apt 4B, New York, NY 10001',
      roommates: [
        { name: 'John Doe', phone: '(555) 123-4567' },
        { name: 'Jane Smith', phone: '(555) 987-6543' },
        { name: 'Mike Johnson', phone: '(555) 456-7890' },
      ],
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading housing information...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Housing
      </Typography>

      <Grid container spacing={4}>
        {/* House Details - Left Side */}
        <Grid item xs={12} md={6}>
          <Card sx={{ border: '1px solid #e0e0e0', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                House Details
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="textSecondary">
                  Address
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {housingInfo?.address || 'Not assigned'}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Roommates
              </Typography>

              <List dense>
                {housingInfo?.roommates?.map((roommate, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={roommate.name}
                      secondary={roommate.phone}
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Facility Reports - Right Side */}
        <Grid item xs={12} md={6}>
          <Card sx={{ border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Facility Reports
              </Typography>

              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Report issues with your housing facility and track their status.
                You can communicate with HR through comments on each report.
              </Typography>

              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/employee/facility-reports')}
                sx={{
                  backgroundColor: '#000000',
                  color: 'white',
                  mb: 2,
                  '&:hover': { backgroundColor: '#333333' },
                }}
              >
                View All Facility Reports
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/employee/dashboard')}
                sx={{
                  borderColor: '#000000',
                  color: '#000000',
                  '&:hover': {
                    borderColor: '#333333',
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                Dashboard
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Housing;
