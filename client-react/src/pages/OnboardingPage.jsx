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

  const reloadSummary = () => setReloadKey(prev => prev + 1);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get('/api/employee/me');
        const data = res.data;

        setApplication(data);
        setStatus(data.onboardingStatus);

        if (data.onboardingStatus === 'Approved') {
          navigate('/home');
        }
      } catch (err) {
        console.error('Error fetching onboarding data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [navigate]);

  if (loading) return <CircularProgress />;
  if (!status) return <Alert severity="error">Unable to load onboarding status.</Alert>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Onboarding Application</Typography>

      {status === 'Not Started' || status === 'Rejected' ? (
        <OnboardingForm initialData={application} status={status} onSubmitSuccess={reloadSummary} />
      ) : (
        <StatusNotice
          status={status}
          feedback={application.hrFeedback} // ensure this exists or change to the correct field
        />
      )}

      <DocumentSummary 
        profilePicUrl={application.profilePicUrl}
        driversLicenseUrl={application.driversLicense?.licenseUrl}
        optReceiptUrl={application.visa?.optReceiptUrl}
        key={reloadKey}
      />
    </Container>
  );
};

export default OnboardingPage;