import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Pagination,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CreateReportDialog from '../components/CreateReportDialog';

const FacilityReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReports: 0,
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Fetch reports
  const fetchReports = React.useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: '6',
          ...(filters.status && { status: filters.status }),
          ...(filters.category && { category: filters.category }),
        });

        const response = await fetch(
          `/api/employee/facility-reports?${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setReports(data.data);
          setPagination(data.pagination);
        } else {
          setError('Failed to fetch reports');
        }
      } catch (error) {
        setError('Error fetching reports: ' + error.message);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Handle report creation success
  const handleReportCreated = () => {
    fetchReports(); // Refresh reports list
  };

  const getStatusColor = (status) => {
    return 'default';
  };

  const getPriorityColor = (priority) => {
    return 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Facility Reports
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            backgroundColor: '#000000',
            color: 'white',
            '&:hover': { backgroundColor: '#333333' },
          }}
        >
          Create Report
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <FilterIcon color="action" />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Safety">Safety</MenuItem>
                <MenuItem value="Utilities">Utilities</MenuItem>
                <MenuItem value="Cleaning">Cleaning</MenuItem>
                <MenuItem value="Security">Security</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Reports Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : reports.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <Typography variant="h6" color="textSecondary">
              No facility reports found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Create your first report to get started
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {reports.map((report) => (
            <Grid item xs={12} md={6} key={report._id}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    borderColor: '#000000',
                  },
                }}
                onClick={() =>
                  navigate(`/employee/facility-reports/${report._id}`)
                }
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 'bold', flex: 1 }}
                    >
                      {report.title}
                    </Typography>
                    <Chip
                      label={report.status}
                      color={getStatusColor(report.status)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 2 }}
                  >
                    {report.description.length > 150
                      ? `${report.description.substring(0, 150)}...`
                      : report.description}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={report.category}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label={report.priority}
                        color={getPriorityColor(report.priority)}
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CommentIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="textSecondary">
                        {report.comments.length}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ display: 'block', mt: 2 }}
                  >
                    Created: {new Date(report.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={(event, page) => fetchReports(page)}
            color="primary"
          />
        </Box>
      )}

      {/* Create Report Dialog - using shared component */}
      <CreateReportDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleReportCreated}
      />
    </Container>
  );
};

export default FacilityReports;
