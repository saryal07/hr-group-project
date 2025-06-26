// This is a placeholder to test Navbar
import { Container, Typography, Card, CardContent } from '@mui/material';

const VisaStatus = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Visa Status Management
      </Typography>
      <Card sx={{ border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Typography variant="body1" color="textSecondary">
            Visa status management page - Place holder for Navbar testing.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            This page would contain the OPT workflow with 4-step document upload
            process (OPT Receipt → OPT EAD → I-983 → I-20) as specified in the
            project requirements.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default VisaStatus;
