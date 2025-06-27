import React from 'react';
import { Alert, Typography, Box } from '@mui/material';

const StatusNotice = ({ status, feedback }) => {
  if (!status) return null;

  const renderNotice = () => {
    switch (status) {
      case 'Pending':
        return (
          <Alert severity="info">
            Your onboarding application is under review. Please wait for HR to approve it.
          </Alert>
        );

      case 'Approved':
        return (
          <Alert severity="success">
            🎉 Your onboarding application has been approved!
          </Alert>
        );

      case 'Rejected':
        return (
          <Box>
            <Alert severity="error">
              Your application was rejected. Please review the feedback and resubmit.
            </Alert>
            {feedback && (
              <Typography sx={{ mt: 1, color: 'error.main' }}>
                <strong>HR Feedback:</strong> {feedback}
              </Typography>
            )}
          </Box>
        );

      case 'Not Started':
      default:
        return null;
    }
  };

  return <Box sx={{ mb: 3 }}>{renderNotice()}</Box>;
};

export default StatusNotice;