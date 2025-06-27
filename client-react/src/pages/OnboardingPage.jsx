import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, CircularProgress, Alert, Container, Box
} from '@mui/material';
import axios from 'axios';
import OnboardingForm from '../components/OnboardingForm';
import DocumentSummary from '../components/DocumentSummary';
import StatusNotice from '../components/StatusNotice';

const OnboardingPage = () => {
  const [status, setStatus] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [reloadKey, setReloadKey] = useState(0);
  const [documents, setDocuments] = useState([]);

  const reloadSummary = () => {
    console.log('Reload summary triggered');
    setReloadKey(prev => prev + 1);
  }

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get('/api/employee/me');
        const data = res.data;

        setApplication(data);
        setStatus(data.onboardingStatus);

      } catch (err) {
        console.error('Error fetching onboarding data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [navigate]);

  useEffect(() => {
    if (status === 'Approved') {
      navigate('/home');
    }
  }, [status, navigate]);


  const fetchDocuments = async () => {
    try {
      const res = await axios.get('/api/documents');
      console.log('Fetched documents:', res.data);
      setDocuments(res.data.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [reloadKey]);

  if (loading) return <CircularProgress />;
  if (!status) return <Alert severity="error">Unable to load onboarding status.</Alert>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Onboarding Application</Typography>

      {status === 'Not Started' || status === 'Rejected' ? (
        <>
          {status === 'Rejected' && application.hrFeedback && (
            <Alert severity="error" sx={{ mb: 2 }}>
              HR Feedback: {application.hrFeedback}
            </Alert>
          )}
          <OnboardingForm
            initialData={application}
            status={status}
            onSubmitSuccess={reloadSummary}
          />
        </>
      ) : (
        <>
        <StatusNotice
          status={status}
          feedback={application.hrFeedback}
        />
        {/* Form Summary Display */}
        {status === 'Pending' && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>Submitted Form Summary</Typography>
            <Box sx={{ pl: 2 }}>
              <Typography><strong>Full Name:</strong> {application.firstName} {application.middleName} {application.lastName}</Typography>
              <Typography><strong>Preferred Name:</strong> {application.preferredName}</Typography>
              <Typography><strong>Email:</strong> {application.email}</Typography>
              <Typography><strong>SSN:</strong> {application.ssn}</Typography>
              <Typography><strong>Date of Birth:</strong> {new Date(application.dob).toLocaleDateString()}</Typography>
              <Typography><strong>Gender:</strong> {application.gender}</Typography>

              <Typography sx={{ mt: 2 }}><strong>Address:</strong></Typography>
              <Typography>{application.address?.building} {application.address?.street}, {application.address?.city}, {application.address?.state} {application.address?.zip}</Typography>

              <Typography sx={{ mt: 2 }}><strong>Contact Info:</strong></Typography>
              <Typography><strong>Cell Phone:</strong> {application.cellPhone}</Typography>
              <Typography><strong>Work Phone:</strong> {application.workPhone}</Typography>

              <Typography sx={{ mt: 2 }}><strong>Car Info:</strong></Typography>
              <Typography><strong>Make:</strong> {application.car?.make} | <strong>Model:</strong> {application.car?.model} | <strong>Color:</strong> {application.car?.color}</Typography>

              <Typography sx={{ mt: 2 }}><strong>Work Authorization:</strong></Typography>
              <Typography>{application.isCitizen ? `Citizen / ${application.residencyType}` : `Visa Type: ${application.visa?.type}`}</Typography>
              {!application.isCitizen && (
                <>
                  {application.visa?.title && <Typography><strong>Visa Title:</strong> {application.visa.title}</Typography>}
                  <Typography><strong>Start Date:</strong> {new Date(application.visa?.startDate).toLocaleDateString()}</Typography>
                  <Typography><strong>End Date:</strong> {new Date(application.visa?.endDate).toLocaleDateString()}</Typography>
                </>
              )}

              {application.hasLicense && (
                <>
                  <Typography sx={{ mt: 2 }}><strong>Driver's License:</strong></Typography>
                  <Typography><strong>Number:</strong> {application.driversLicense?.number}</Typography>
                  <Typography><strong>Expiration:</strong> {new Date(application.driversLicense?.expirationDate).toLocaleDateString()}</Typography>
                </>
              )}

              <Typography sx={{ mt: 2 }}><strong>Reference:</strong></Typography>
              <Typography>{application.reference?.firstName} {application.reference?.middleName} {application.reference?.lastName}</Typography>
              <Typography>{application.reference?.relationship}</Typography>
              <Typography>{application.reference?.email} | {application.reference?.phone}</Typography>

              {application.emergencyContacts?.length > 0 && (
                <>
                  <Typography sx={{ mt: 2 }}><strong>Emergency Contacts:</strong></Typography>
                  {application.emergencyContacts.map((ec, idx) => (
                    <Box key={idx} sx={{ pl: 2, mb: 1 }}>
                      <Typography>🔹 {ec.firstName} {ec.middleName} {ec.lastName}</Typography>
                      <Typography>📞 {ec.phone} | 📧 {ec.email} | 🧑‍🤝‍🧑 {ec.relationship}</Typography>
                    </Box>
                  ))}
                </>
              )}
            </Box>
          </Box>
        )}
        </>
      )}

      <DocumentSummary documents={documents} />
    </Container>
  );
};

export default OnboardingPage;