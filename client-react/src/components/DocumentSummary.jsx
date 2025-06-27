import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

const DocumentSummary = ({ documents = [] }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Uploaded Documents
      </Typography>
      <Stack spacing={2}>
        {documents.length > 0 ? (
          documents.map((doc) => (
            <Box key={doc._id}>
              <Typography variant="subtitle1">
                {doc.documentType.replace(/_/g, ' ').toUpperCase()} ({doc.status})
              </Typography>
              {doc.downloadUrl ? (
                <>
                  <Button
                    href={doc.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    sx={{ mr: 2 }}
                  >
                    Preview
                  </Button>
                  <Button
                    href={doc.downloadUrl}
                    download
                    variant="contained"
                    color="primary"
                  >
                    Download
                  </Button>
                </>
              ) : (
                <Typography color="text.secondary">No URL available</Typography>
              )}
            </Box>
          ))
        ) : (
          <Typography color="text.secondary">No documents uploaded yet.</Typography>
        )}
      </Stack>
    </Box>
  );
};

export default DocumentSummary;