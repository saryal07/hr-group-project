// This is a placeholder to test Navbar

import React from 'react';
import { Container, Typography, Card, CardContent } from '@mui/material';

const PersonalInfo = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Personal Information
      </Typography>
      <Card sx={{ border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Typography variant="body1" color="textSecondary">
            Personal information management page - Place holder for Navbar
            testing.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            This page would contain editable sections for name, address, contact
            info, employment details, and emergency contacts as specified in the
            project requirements.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PersonalInfo;
