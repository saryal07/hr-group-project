import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';

const CreateReportDialog = ({ open, onClose, onSuccess }) => {
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Clear form when dialog closed
  const handleClose = () => {
    setNewReport({
      title: '',
      description: '',
      category: '',
      priority: 'Medium',
    });
    setError('');
    onClose();
  };

  // Create new report
  const handleCreateReport = async () => {
    if (!newReport.title || !newReport.description || !newReport.category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setCreating(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/employee/facility-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newReport),
      });

      if (response.ok) {
        const data = await response.json();
        handleClose();
        setError('');
        // Call success callback with new report data
        if (onSuccess) {
          onSuccess(data.data);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create report');
      }
    } catch (error) {
      setError('Error creating report: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Facility Report</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title *"
          fullWidth
          variant="outlined"
          value={newReport.title}
          onChange={(e) =>
            setNewReport({ ...newReport, title: e.target.value })
          }
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Description *"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={newReport.description}
          onChange={(e) =>
            setNewReport({ ...newReport, description: e.target.value })
          }
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category *</InputLabel>
          <Select
            value={newReport.category}
            label="Category *"
            onChange={(e) =>
              setNewReport({ ...newReport, category: e.target.value })
            }
          >
            <MenuItem value="Maintenance">Maintenance</MenuItem>
            <MenuItem value="Safety">Safety</MenuItem>
            <MenuItem value="Utilities">Utilities</MenuItem>
            <MenuItem value="Cleaning">Cleaning</MenuItem>
            <MenuItem value="Security">Security</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select
            value={newReport.priority}
            label="Priority"
            onChange={(e) =>
              setNewReport({ ...newReport, priority: e.target.value })
            }
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>

        {/* Error Display */}
        {error && (
          <div style={{ color: 'red', marginTop: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleCreateReport}
          variant="contained"
          disabled={creating}
          sx={{
            backgroundColor: '#000000',
            color: 'white',
            '&:hover': { backgroundColor: '#333333' },
          }}
        >
          {creating ? <CircularProgress size={24} /> : 'Create Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateReportDialog;
