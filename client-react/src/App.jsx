import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import Register from './pages/Register';
import Login from './pages/Login';
import OnboardingPage from './pages/OnboardingPage';
import Home from './pages/Home';
import AdminInvite from './pages/AdminInvite';
import PersonalInformation from './pages/PersonalInformation';
import Housing from './pages/Housing';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import FacilityReports from './pages/FacilityReports';
import ReportDetail from './pages/ReportDetail';
import VisaStatusManagementPage from './pages/VisaStatusManagementPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;

  return user ? children : <Navigate to="/login" replace />;
};

// Layout wrapper for authenticated pages
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="App">
      <Navigation />
      {children}
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route
              path="/register/:token"
              element={
                <Container maxWidth="sm">
                  <Register />
                </Container>
              }
            />
            <Route
              path="/login"
              element={
                <Container maxWidth="sm">
                  <Login />
                </Container>
              }
            />

            {/* Protected routes with navigation */}
            <Route
              path="/onboarding-page"
              element={
                <PrivateRoute>
                  <OnboardingPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <AuthenticatedLayout>
                    <Home />
                  </AuthenticatedLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/personal-information"
              element={
                <PrivateRoute>
                  <AuthenticatedLayout>
                    <PersonalInformation />
                  </AuthenticatedLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/housing"
              element={
                <PrivateRoute>
                  <AuthenticatedLayout>
                    <Housing />
                  </AuthenticatedLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/visa-status"
              element={
                <PrivateRoute>
                  <AuthenticatedLayout>
                    <VisaStatusManagementPage />
                  </AuthenticatedLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-invite"
              element={
                <PrivateRoute>
                  <AuthenticatedLayout>
                    <AdminInvite />
                  </AuthenticatedLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <AuthenticatedLayout>
                    <Dashboard />
                  </AuthenticatedLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/facility-reports"
              element={
                <PrivateRoute>
                  <AuthenticatedLayout>
                    <FacilityReports />
                  </AuthenticatedLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/facility-reports/:id"
              element={
                <PrivateRoute>
                  <AuthenticatedLayout>
                    <ReportDetail />
                  </AuthenticatedLayout>
                </PrivateRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
