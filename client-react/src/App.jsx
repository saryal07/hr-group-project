import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FacilityReports from './pages/FacilityReports';
import ReportDetail from './pages/ReportDetail';
import PersonalInfo from './pages/PersonalInfo';
import VisaStatus from './pages/VisaStatus';
import Housing from './pages/Housing';
import Navbar from './components/Navbar';

// Create a minimal black and white theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#666666',
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          border: '1px solid #e0e0e0',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/" />;
};

// Layout Component with Navbar
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

// Component to redirect authenticated users away from login
const RedirectIfAuthenticated = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Navigate to="/employee/personal-info" /> : <Login />;
};

// App Component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/employee/personal-info"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PersonalInfo />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/visa-status"
              element={
                <ProtectedRoute>
                  <Layout>
                    <VisaStatus />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/housing"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Housing />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Dashboard Route */}
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Facility Reports Routes */}
            <Route
              path="/employee/facility-reports"
              element={
                <ProtectedRoute>
                  <Layout>
                    <FacilityReports />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/facility-reports/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ReportDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Redirect authenticated users from login */}
            <Route
              path="/login"
              element={
                <AuthProvider>
                  <RedirectIfAuthenticated />
                </AuthProvider>
              }
            />

            {/* Catch all route - redirect to personal info if authenticated, login if not */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <Navigate to="/employee/personal-info" replace />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
