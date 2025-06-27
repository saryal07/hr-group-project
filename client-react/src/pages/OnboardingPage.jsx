import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Button, Card, CardContent, Container } from '@mui/material';
import { Person, AccountBox } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewProfile = () => {
    navigate('/personal-information');
  };

  const handleViewHousing = () => {
    navigate('/housing');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" gutterBottom color="primary">
          Welcome to HR Employee Portal
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Hello {user?.firstName || user?.username || 'Employee'}! 
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Get started by managing your personal information and viewing your housing details.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 300, cursor: 'pointer', '&:hover': { elevation: 8 } }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Person sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Personal Information
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              View and update your personal details, contact information, and documents.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleViewProfile}
              startIcon={<AccountBox />}
            >
              View Profile
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 300, cursor: 'pointer', '&:hover': { elevation: 8 } }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Housing Information
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              View your housing assignment, roommates, and submit facility reports.
            </Typography>
            <Button 
              variant="outlined" 
              size="large"
              onClick={handleViewHousing}
            >
              View Housing
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default OnboardingPage;