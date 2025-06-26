import React from 'react';
import { Box, Typography, Link, Button, Stack } from '@mui/material';

const DocumentSummary = ({ profilePicUrl, driversLicenseUrl, optReceiptUrl }) => {
  const docs = [
    { label: 'Profile Picture', url: profilePicUrl },
    { label: 'Driver’s License', url: driversLicenseUrl },
    { label: 'Work Authorization (OPT Receipt)', url: optReceiptUrl }
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Uploaded Documents
      </Typography>
      <Stack spacing={2}>
        {docs.map(
          (doc, idx) =>
            doc.url && (
              <Box key={idx}>
                <Typography variant="subtitle1">{doc.label}</Typography>
                <Button
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  sx={{ mr: 2 }}
                >
                  Preview
                </Button>
                <Button
                  href={doc.url}
                  download
                  variant="contained"
                  color="primary"
                >
                  Download
                </Button>
              </Box>
            )
        )}
        {!docs.some((doc) => doc.url) && (
          <Typography color="text.secondary">No documents uploaded yet.</Typography>
        )}
      </Stack>
    </Box>
  );
};

export default DocumentSummary;