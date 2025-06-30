import React, { useState } from 'react';
import * as MUI from '@mui/material';
import { 
  CloudUpload, 
  Download, 
  Visibility, 
  CheckCircle, 
  Error, 
  Schedule
} from '@mui/icons-material';
import visaStatusApi from '../services/visaStatusApi';

const DocumentStepCard = ({ stepData, onStatusUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notification, setNotification] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle color="success" />;
      case 'rejected':
        return <Error color="error" />;
      case 'pending':
        return <Schedule color="warning" />;
      default:
        return null;
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setNotification(null);

    try {
      await visaStatusApi.uploadDocument(file, stepData.documentType, stepData.stepName);
      onStatusUpdate(); // Refresh the workflow status
      setNotification({ severity: 'success', message: 'Document uploaded successfully!' });
    } catch (error) {
      console.error('Upload failed:', error);
      setNotification({ 
        severity: 'error', 
        message: error.response?.data?.message || 'Upload failed. Please try again.' 
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async () => {
    if (!stepData.document?.downloadUrl) return;
    
    try {
      const link = document.createElement('a');
      link.href = stepData.document.downloadUrl;
      link.download = stepData.document.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      setNotification({ severity: 'error', message: 'Download failed. Please try again.' });
    }
  };

  const handlePreview = () => {
    if (!stepData.document?.downloadUrl) return;
    window.open(stepData.document.downloadUrl, '_blank');
  };

  const handleTemplateDownload = async (templateType) => {
    try {
      const blob = await visaStatusApi.downloadTemplate(templateType);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `i983-${templateType}-template.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Template download failed:', error);
      setNotification({ severity: 'error', message: 'Template download failed. Please try again.' });
    }
  };

  return (
    <MUI.Card sx={{ mb: 2, border: 1, borderColor: 'divider' }}>
      <MUI.CardContent>
        {/* Notification Alert */}
        {notification && (
          <MUI.Alert 
            severity={notification.severity} 
            sx={{ mb: 2 }}
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </MUI.Alert>
        )}

        <MUI.Box display="flex" alignItems="center" mb={2}>
          {getStatusIcon(stepData.status)}
          <MUI.Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
            {stepData.stepName}
          </MUI.Typography>
          <MUI.Chip
            label={stepData.status === 'not_uploaded' ? 'Not Started' : stepData.status}
            color={getStatusColor(stepData.status)}
            size="small"
          />
        </MUI.Box>

        <MUI.Typography variant="body2" color="text.secondary" mb={2}>
          {stepData.message}
        </MUI.Typography>

        {/* Document Actions */}
        <MUI.Box display="flex" gap={1} flexWrap="wrap">
          {/* Upload Button - Show if can upload */}
          {stepData.canUpload && (
            <MUI.Button
              variant="contained"
              startIcon={<CloudUpload />}
              component="label"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
              <input
                type="file"
                hidden
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
              />
            </MUI.Button>
          )}

          {/* Re-upload Button - Show specifically for rejected documents */}
          {stepData.status === 'rejected' && (
            <MUI.Button
              variant="contained"
              color="error"
              startIcon={<CloudUpload />}
              component="label"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Re-upload Document'}
              <input
                type="file"
                hidden
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
              />
            </MUI.Button>
          )}

          {/* Download Button - Show if document exists */}
          {stepData.document && (
            <>
              <MUI.Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleDownload}
              >
                Download
              </MUI.Button>
              <MUI.Button
                variant="outlined"
                startIcon={<Visibility />}
                onClick={handlePreview}
              >
                Preview
              </MUI.Button>
            </>
          )}

          {/* I-983 Template Downloads */}
          {stepData.documentType === 'i_983' && stepData.status === 'approved' && (
            <>
              <MUI.Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => handleTemplateDownload('empty')}
              >
                Empty Template
              </MUI.Button>
              <MUI.Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => handleTemplateDownload('sample')}
              >
                Sample Template
              </MUI.Button>
            </>
          )}
        </MUI.Box>

        {/* HR Feedback - Show if rejected */}
        {stepData.status === 'rejected' && stepData.document?.hrFeedback && (
          <MUI.Alert severity="error" sx={{ mt: 2 }}>
            <MUI.Typography variant="body2">
              <strong>HR Feedback:</strong> {stepData.document.hrFeedback}
            </MUI.Typography>
          </MUI.Alert>
        )}

        {/* Upload Progress */}
        {uploading && (
          <MUI.Box sx={{ mt: 2 }}>
            <MUI.LinearProgress variant="determinate" value={uploadProgress} />
            <MUI.Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Uploading... {uploadProgress}%
            </MUI.Typography>
          </MUI.Box>
        )}
      </MUI.CardContent>
    </MUI.Card>
  );
};

export default DocumentStepCard; 