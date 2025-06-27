import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';
import Register from './pages/Register';
import Login from './pages/Login';
import OnboardingPage from './pages/OnboardingPage';
import AdminInvite from './pages/AdminInvite';
import PersonalInformation from './pages/PersonalInformation';
import Housing from './pages/Housing';
import Navigation from './components/Navigation';
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
            <Route path="/register/:token" element={
              <Container maxWidth="sm">
                <Register />
              </Container>
            } />
            <Route path="/login" element={
              <Container maxWidth="sm">
                <Login />
              </Container>
            } />
            
            {/* Protected routes with navigation */}
            <Route
              path="/onboarding-page"
              element={
                <PrivateRoute>
                  <AuthenticatedLayout>
                    <OnboardingPage />
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
              path="/admin-invite" 
              element={
                <PrivateRoute>
                  <AuthenticatedLayout>
                    <AdminInvite />
                  </AuthenticatedLayout>
                </PrivateRoute>
              }
            />
            
            {/* Default redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;