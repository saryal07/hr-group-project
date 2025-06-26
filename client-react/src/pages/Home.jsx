import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement logout logic (e.g., clear tokens, call logout API)
    navigate('/login');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          Welcome to the Employee Portal
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Your onboarding has been approved. You can now explore the platform.
        </Typography>

        {/* Example navigation buttons */}
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/profile')}
            sx={{ mr: 2 }}
            disabled
          >
            View Profile
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleLogout}
            disabled
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;