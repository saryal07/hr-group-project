import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Pagination,
  Chip,
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
          ...(filters.priority && { priority: filters.priority }),
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
    switch (status) {
      case 'Open':
        return 'error';
      case 'In Progress':
        return 'warning';
      case 'Resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  // long titles
  const truncateTitle = (title, maxLength = 50) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
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
            backgroundColor: 'primary.main',
            '&:hover': { backgroundColor: 'primary.dark' },
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
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={filters.priority}
                label="Priority"
                onChange={(e) =>
                  setFilters({ ...filters, priority: e.target.value })
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
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

      {/* Reports List - consistent width for design*/}
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
        // Vertical layout
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {reports.map((report) => (
            <Card
              key={report._id}
              sx={{
                width: '100%', // Full width to match the filter bar
                cursor: 'pointer',
                border: '1px solid #e0e0e0',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
              onClick={() => navigate(`/facility-reports/${report._id}`)}
            >
              <CardContent sx={{ py: 2 }}>
                {/* Header with truncated title and status */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      flex: 1,
                      mr: 2,
                      // Handle long titles
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={report.title} // Show full title on hover
                  >
                    {truncateTitle(report.title, 60)}
                  </Typography>
                  <Chip
                    label={report.status}
                    color={getStatusColor(report.status)}
                    size="small"
                  />
                </Box>

                {/* Description with consistent truncation */}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    mb: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2, // Show max 2 lines
                    WebkitBoxOrient: 'vertical',
                  }}
                  title={report.description} // Show full description on hover
                >
                  {report.description}
                </Typography>

                {/* Bottom row with metadata */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  {/* Left side: Category and Priority */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={report.category}
                      variant="outlined"
                      size="small"
                      sx={{ fontSize: '0.75rem' }}
                    />
                    <Chip
                      label={report.priority}
                      color={getPriorityColor(report.priority)}
                      variant="outlined"
                      size="small"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  </Box>

                  {/* Right side: Comments and Date */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <CommentIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="textSecondary">
                        {report.comments.length}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
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

      {/* Create Report Dialog */}
      <CreateReportDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleReportCreated}
      />
    </Container>
  );
};

export default FacilityReports;
