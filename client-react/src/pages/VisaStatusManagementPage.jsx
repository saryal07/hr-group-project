import React, { useState, useEffect } from 'react';
import * as MUI from '@mui/material';
import { Refresh, Info } from '@mui/icons-material';
import DocumentStepCard from '../components/DocumentStepCard';
import WorkflowProgress from '../components/WorkflowProgress';
import visaStatusApi from '../services/visaStatusApi';

const VisaStatusManagementPage = () => {
  const [workflowData, setWorkflowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkflowStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await visaStatusApi.getWorkflowStatus();
      setWorkflowData(response.data || []);
    } catch (err) {
      console.error('Failed to fetch workflow status:', err);
      setError(err.response?.data?.message || 'Failed to load visa status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflowStatus();
  }, []);

  const handleStatusUpdate = () => {
    fetchWorkflowStatus();
  };

  if (loading) {
    return (
      <MUI.Container maxWidth="md">
        <MUI.Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <MUI.CircularProgress />
        </MUI.Box>
      </MUI.Container>
    );
  }

  if (error) {
    return (
      <MUI.Container maxWidth="md">
        <MUI.Box my={4}>
          <MUI.Alert severity="error" action={
            <MUI.Button color="inherit" size="small" onClick={fetchWorkflowStatus}>
              Retry
            </MUI.Button>
          }>
            {error}
          </MUI.Alert>
        </MUI.Box>
      </MUI.Container>
    );
  }

  return (
    <MUI.Container maxWidth="md">
      <MUI.Box my={4}>
        {/* Header */}
        <MUI.Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <MUI.Typography variant="h4" component="h1" gutterBottom>
            Visa Status Management
          </MUI.Typography>
          <MUI.Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchWorkflowStatus}
            disabled={loading}
          >
            Refresh
          </MUI.Button>
        </MUI.Box>

        {/* Info Alert */}
        <MUI.Alert severity="info" sx={{ mb: 3 }}>
          <MUI.Typography variant="body2">
            <strong>OPT Workflow:</strong> Follow the steps below to complete your OPT visa process. 
            Each document must be approved by HR before you can proceed to the next step.
          </MUI.Typography>
        </MUI.Alert>

        {/* Workflow Progress */}
        <WorkflowProgress workflowData={workflowData} />

        {/* Document Steps */}
        <MUI.Box>
          <MUI.Typography variant="h6" gutterBottom>
            Document Steps
          </MUI.Typography>
          
          {workflowData.length === 0 ? (
            <MUI.Alert severity="warning">
              No workflow data available. Please contact HR if you believe this is an error.
            </MUI.Alert>
          ) : (
            workflowData.map((stepData) => (
              <DocumentStepCard
                key={stepData.stepOrder}
                stepData={stepData}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          )}
        </MUI.Box>

        {/* Help Section */}
        <MUI.Box mt={4}>
          <MUI.Card variant="outlined">
            <MUI.CardContent>
              <MUI.Typography variant="h6" gutterBottom>
                <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
                Need Help?
              </MUI.Typography>
              <MUI.Typography variant="body2" color="text.secondary">
                • Each document must be uploaded in the correct order
                • Only PDF, PNG, and JPG files are accepted (max 5MB)
                • HR will review your documents and provide feedback
                • You can download and preview your uploaded documents
                • For I-983, download the template, fill it out, and upload the completed form
              </MUI.Typography>
            </MUI.CardContent>
          </MUI.Card>
        </MUI.Box>
      </MUI.Box>
    </MUI.Container>
  );
};

export default VisaStatusManagementPage; 