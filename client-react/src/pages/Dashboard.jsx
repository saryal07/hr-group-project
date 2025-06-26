import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Paper,
  LinearProgress,
  Button,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreateReportDialog from '../components/CreateReportDialog';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalReports: 0,
    openReports: 0,
    inProgressReports: 0,
    resolvedReports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/employee/facility-reports', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const reports = data.data;

        setStats({
          totalReports: reports.length,
          openReports: reports.filter((r) => r.status === 'Open').length,
          inProgressReports: reports.filter((r) => r.status === 'In Progress')
            .length,
          resolvedReports: reports.filter((r) => r.status === 'Resolved')
            .length,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Handle report creation success
  const handleReportCreated = (newReport) => {
    // Refresh the stats to reflect the new report
    fetchStats();
  };

  const StatCard = ({ title, value, color }) => (
    <Card sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box sx={{ textAlign: 'center' }}>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography
            variant="h3"
            sx={{ color: '#000000', fontWeight: 'bold' }}
          >
            {loading ? (
              <LinearProgress sx={{ width: 60, mx: 'auto' }} />
            ) : (
              value
            )}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 4, backgroundColor: '#000000', color: 'white' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome back, {user?.username}
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Here's an overview of your facility reports
        </Typography>
      </Paper>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Reports" value={stats.totalReports} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Open Reports" value={stats.openReports} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="In Progress" value={stats.inProgressReports} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Resolved" value={stats.resolvedReports} />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, border: '1px solid #e0e0e0' }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 3 }}
        >
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                backgroundColor: '#000000',
                color: 'white',
                '&:hover': { backgroundColor: '#333333' },
              }}
            >
              Create New Report
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              onClick={() => navigate('/employee/facility-reports')}
              sx={{
                borderColor: '#000000',
                color: '#000000',
                '&:hover': {
                  borderColor: '#333333',
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              View All Reports
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Create Report Dialog */}
      <CreateReportDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleReportCreated}
      />
    </Container>
  );
};

export default Dashboard;
