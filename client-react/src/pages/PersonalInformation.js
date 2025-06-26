import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Person,
  LocationOn,
  Phone,
  Work,
  ContactEmergency,
  Description,
  Download,
  Visibility,
  Add
} from '@mui/icons-material';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload';

const PersonalInformation = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSection, setEditingSection] = useState(null);
  const [tempData, setTempData] = useState({});
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Token loaded from localStorage');
    }
    
    fetchEmployeeData();
    fetchDocuments();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get('/api/employee/me');
      setEmployee(response.data);
    } catch (error) {
      console.error('Failed to fetch employee data:', error);
      setError('Failed to fetch employee data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/api/documents');
      setDocuments(response.data.data || []);
    } catch (error) {
      setDocuments([]);
    }
  };

  const handleEdit = (section) => {
    if (section === 'name') {
      setTempData({
        firstName: employee?.firstName || '',
        lastName: employee?.lastName || '',
        middleName: employee?.middleName || '',
        preferredName: employee?.preferredName || '',
        email: employee?.email || '',
        ssn: employee?.ssn || '',
        dob: employee?.dob ? employee.dob.substring(0, 10) : '',
        gender: employee?.gender || ''
      });
    } else if (section === 'address') {
      setTempData({
        building: employee?.address?.building || '',
        street: employee?.address?.street || '',
        city: employee?.address?.city || '',
        state: employee?.address?.state || '',
        zip: employee?.address?.zip || ''
      });
    } else if (section === 'contact') {
      setTempData({
        cellPhone: employee?.cellPhone || '',
        workPhone: employee?.workPhone || ''
      });
    } else if (section === 'employment') {
      setTempData({
        visaTitle: employee?.visa?.title || '',
        startDate: employee?.visa?.startDate ? employee.visa.startDate.substring(0, 10) : '',
        endDate: employee?.visa?.endDate ? employee.visa.endDate.substring(0, 10) : ''
      });
    } else if (section === 'emergencyContact') {
      setTempData({
        firstName: employee?.emergencyContacts?.[0]?.firstName || '',
        lastName: employee?.emergencyContacts?.[0]?.lastName || '',
        middleName: employee?.emergencyContacts?.[0]?.middleName || '',
        phone: employee?.emergencyContacts?.[0]?.phone || '',
        email: employee?.emergencyContacts?.[0]?.email || '',
        relationship: employee?.emergencyContacts?.[0]?.relationship || ''
      });
    }
    setEditingSection(section);
  };

  const handleCancel = () => {
    if (hasChanges()) {
      setShowDiscardDialog(true);
    } else {
      setEditingSection(null);
      setTempData({});
    }
  };

  const hasChanges = () => {
    if (!editingSection || !employee) return false;
    let original = {};
    if (editingSection === 'name') {
      original = {
        firstName: employee?.firstName || '',
        lastName: employee?.lastName || '',
        middleName: employee?.middleName || '',
        preferredName: employee?.preferredName || '',
        email: employee?.email || '',
        ssn: employee?.ssn || '',
        dob: employee?.dob ? employee.dob.substring(0, 10) : '',
        gender: employee?.gender || ''
      };
    } else if (editingSection === 'address') {
      original = {
        building: employee?.address?.building || '',
        street: employee?.address?.street || '',
        city: employee?.address?.city || '',
        state: employee?.address?.state || '',
        zip: employee?.address?.zip || ''
      };
    } else if (editingSection === 'contact') {
      original = {
        cellPhone: employee?.cellPhone || '',
        workPhone: employee?.workPhone || ''
      };
    } else if (editingSection === 'employment') {
      original = {
        visaTitle: employee?.visa?.title || '',
        startDate: employee?.visa?.startDate ? employee.visa.startDate.substring(0, 10) : '',
        endDate: employee?.visa?.endDate ? employee.visa.endDate.substring(0, 10) : ''
      };
    } else if (editingSection === 'emergencyContact') {
      original = {
        firstName: employee?.emergencyContacts?.[0]?.firstName || '',
        lastName: employee?.emergencyContacts?.[0]?.lastName || '',
        middleName: employee?.emergencyContacts?.[0]?.middleName || '',
        phone: employee?.emergencyContacts?.[0]?.phone || '',
        email: employee?.emergencyContacts?.[0]?.email || '',
        relationship: employee?.emergencyContacts?.[0]?.relationship || ''
      };
    }
    return JSON.stringify(original) !== JSON.stringify(tempData);
  };

  const handleSave = async () => {
    let update = {};
    if (editingSection === 'name') {
      update = {
        firstName: tempData.firstName,
        lastName: tempData.lastName,
        middleName: tempData.middleName,
        preferredName: tempData.preferredName,
        email: tempData.email,
        ssn: tempData.ssn,
        dob: tempData.dob,
        gender: tempData.gender ? tempData.gender.toLowerCase() : ''
      };
    } else if (editingSection === 'address') {
      update = {
        address: {
          building: tempData.building,
          street: tempData.street,
          city: tempData.city,
          state: tempData.state,
          zip: tempData.zip
        }
      };
    } else if (editingSection === 'contact') {
      update = {
        cellPhone: tempData.cellPhone,
        workPhone: tempData.workPhone
      };
    } else if (editingSection === 'employment') {
      update = {
        visa: {
          title: tempData.visaTitle,
          startDate: tempData.startDate,
          endDate: tempData.endDate
        }
      };
    } else if (editingSection === 'emergencyContact') {
      update = {
        emergencyContacts: [
          {
            firstName: tempData.firstName,
            lastName: tempData.lastName,
            middleName: tempData.middleName,
            phone: tempData.phone,
            email: tempData.email,
            relationship: tempData.relationship
          }
        ]
      };
    }
    try {
      const response = await axios.put('/api/employee/me', update);
      setEmployee(response.data);
    } catch (error) {
      setError('Failed to save changes');
    } finally {
      setEditingSection(null);
      setTempData({});
    }
  };

  const handleDiscardConfirm = () => {
    setEditingSection(null);
    setTempData({});
    setShowDiscardDialog(false);
  };

  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDocumentUpload = () => {
    setShowUploadDialog(true);
  };

  const handleDocumentUploadSuccess = () => {
    setShowUploadDialog(false);
    fetchDocuments();
  };

  const handleDocumentDownload = async (documentId) => {
    try {
      const response = await axios.get(`/api/documents/${documentId}`);
      const downloadUrl = response.data.data.downloadUrl;
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      }
    } catch (error) {
      setError('Failed to download document');
    }
  };

  const handleDocumentPreview = async (documentId) => {
    try {
      const response = await axios.get(`/api/documents/${documentId}`);
      const downloadUrl = response.data.data.downloadUrl;
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      }
    } catch (error) {
      setError('Failed to preview document');
    }
  };

  const renderSection = (title, icon, fields, sectionKey) => {
    const isEditing = editingSection === sectionKey;
    let data = {};
    
    if (isEditing) {
      data = tempData;
    } else {
      // Map the actual employee data structure to the expected field names
      if (sectionKey === 'name') {
        data = {
          firstName: employee?.firstName || '',
          lastName: employee?.lastName || '',
          middleName: employee?.middleName || '',
          preferredName: employee?.preferredName || '',
          email: employee?.email || '',
          ssn: employee?.ssn || '',
          dob: employee?.dob ? employee.dob.substring(0, 10) : '',
          gender: employee?.gender || ''
        };
      } else if (sectionKey === 'address') {
        data = {
          building: employee?.address?.building || '',
          street: employee?.address?.street || '',
          city: employee?.address?.city || '',
          state: employee?.address?.state || '',
          zip: employee?.address?.zip || ''
        };
      } else if (sectionKey === 'contact') {
        data = {
          cellPhone: employee?.cellPhone || '',
          workPhone: employee?.workPhone || ''
        };
      } else if (sectionKey === 'employment') {
        data = {
          visaTitle: employee?.visa?.title || '',
          startDate: employee?.visa?.startDate ? employee.visa.startDate.substring(0, 10) : '',
          endDate: employee?.visa?.endDate ? employee.visa.endDate.substring(0, 10) : ''
        };
      } else if (sectionKey === 'emergencyContact') {
        data = {
          firstName: employee?.emergencyContacts?.[0]?.firstName || '',
          lastName: employee?.emergencyContacts?.[0]?.lastName || '',
          middleName: employee?.emergencyContacts?.[0]?.middleName || '',
          phone: employee?.emergencyContacts?.[0]?.phone || '',
          email: employee?.emergencyContacts?.[0]?.email || '',
          relationship: employee?.emergencyContacts?.[0]?.relationship || ''
        };
      }
    }

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center">
              {icon}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {title}
              </Typography>
            </Box>
            {!isEditing && (
              <Button
                startIcon={<Edit />}
                onClick={() => handleEdit(sectionKey)}
                variant="outlined"
                size="small"
              >
                Edit
              </Button>
            )}
            {isEditing && (
              <Box>
                <Button
                  startIcon={<Save />}
                  onClick={handleSave}
                  variant="contained"
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Save
                </Button>
                <Button
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  variant="outlined"
                  size="small"
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
          
          <Grid container spacing={2}>
            {fields.map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  value={data[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  disabled={!isEditing}
                  variant={isEditing ? "outlined" : "standard"}
                  InputProps={{
                    readOnly: !isEditing,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Personal Information
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Name Section */}
      {renderSection(
        'Name',
        <Person color="primary" />,
        [
          { name: 'firstName', label: 'First Name' },
          { name: 'lastName', label: 'Last Name' },
          { name: 'middleName', label: 'Middle Name' },
          { name: 'preferredName', label: 'Preferred Name' },
          { name: 'email', label: 'Email' },
          { name: 'ssn', label: 'SSN' },
          { name: 'dob', label: 'Date of Birth' },
          { name: 'gender', label: 'Gender' }
        ],
        'name'
      )}

      {/* Address Section */}
      {renderSection(
        'Address',
        <LocationOn color="primary" />,
        [
          { name: 'building', label: 'Building/Apt #' },
          { name: 'street', label: 'Street Name' },
          { name: 'city', label: 'City' },
          { name: 'state', label: 'State' },
          { name: 'zip', label: 'ZIP Code' }
        ],
        'address'
      )}

      {/* Contact Info Section */}
      {renderSection(
        'Contact Info',
        <Phone color="primary" />,
        [
          { name: 'cellPhone', label: 'Cell Phone' },
          { name: 'workPhone', label: 'Work Phone' }
        ],
        'contact'
      )}

      {/* Employment Section */}
      {renderSection(
        'Employment',
        <Work color="primary" />,
        [
          { name: 'visaTitle', label: 'Visa Title' },
          { name: 'startDate', label: 'Start Date' },
          { name: 'endDate', label: 'End Date' }
        ],
        'employment'
      )}

      {/* Emergency Contact Section */}
      {renderSection(
        'Emergency Contact',
        <ContactEmergency color="primary" />,
        [
          { name: 'firstName', label: 'First Name' },
          { name: 'lastName', label: 'Last Name' },
          { name: 'middleName', label: 'Middle Name' },
          { name: 'phone', label: 'Phone' },
          { name: 'email', label: 'Email' },
          { name: 'relationship', label: 'Relationship' }
        ],
        'emergencyContact'
      )}

      {/* Documents Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center">
              <Description color="primary" />
              <Typography variant="h6" sx={{ ml: 1 }}>
                Documents
              </Typography>
            </Box>
            <Button
              startIcon={<Add />}
              onClick={handleDocumentUpload}
              variant="contained"
              size="small"
            >
              Upload Document
            </Button>
          </Box>
          
          {documents.length === 0 ? (
            <Typography color="textSecondary">
              No documents uploaded yet.
            </Typography>
          ) : (
            <List>
              {documents.map((doc) => (
                <ListItem
                  key={doc._id}
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        onClick={() => handleDocumentPreview(doc._id)}
                        title="Preview"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDocumentDownload(doc._id)}
                        title="Download"
                      >
                        <Download />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    <Description />
                  </ListItemIcon>
                  <ListItemText
                    primary={doc.originalName}
                    secondary={
                      <Box>
                        <Chip 
                          label={doc.documentType} 
                          size="small" 
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="caption" color="textSecondary">
                          Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Discard Changes Dialog */}
      <Dialog open={showDiscardDialog} onClose={() => setShowDiscardDialog(false)}>
        <DialogTitle>Discard Changes?</DialogTitle>
        <DialogContent>
          <Typography>
            You have unsaved changes. Are you sure you want to discard them?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDiscardDialog(false)}>Cancel</Button>
          <Button onClick={handleDiscardConfirm} color="error">
            Discard
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Upload Dialog */}
      <DocumentUpload
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onSuccess={handleDocumentUploadSuccess}
      />
    </Container>
  );
};

export default PersonalInformation; 