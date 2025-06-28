import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import axios from 'axios';

const DocumentUpload = ({ open, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const documentTypes = [
    { value: 'drivers_license', label: 'Driver\'s License' },
    { value: 'profile_picture', label: 'Profile Picture' },
    { value: 'opt_receipt', label: 'OPT Receipt' },
    { value: 'opt_ead', label: 'OPT EAD' },
    { value: 'i_983', label: 'I-983' },
    { value: 'i_20', label: 'I-20' }
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only PDF, PNG, and JPG files are allowed.');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      setError('Please select a file and document type.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('documentType', documentType);
      if (description) {
        formData.append('description', description);
      }

      await axios.post('/api/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset form
      setSelectedFile(null);
      setDocumentType('');
      setDescription('');
      
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedFile(null);
      setDocumentType('');
      setDescription('');
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Document</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mb: 3 }}>
          <input
            accept=".pdf,.png,.jpg,.jpeg"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileSelect}
          />
          <label htmlFor="file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ py: 2 }}
            >
              {selectedFile ? selectedFile.name : 'Choose File'}
            </Button>
          </label>
          {selectedFile && (
            <Box sx={{ mt: 1 }}>
              <Chip 
                label={`${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`}
                color="primary"
                variant="outlined"
              />
            </Box>
          )}
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Document Type</InputLabel>
          <Select
            value={documentType}
            label="Document Type"
            onChange={(e) => setDocumentType(e.target.value)}
          >
            {documentTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        <Typography variant="caption" color="textSecondary">
          Supported formats: PDF, PNG, JPG. Maximum file size: 5MB.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleUpload} 
          variant="contained" 
          disabled={loading || !selectedFile || !documentType}
        >
          {loading ? <CircularProgress size={20} /> : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentUpload; 