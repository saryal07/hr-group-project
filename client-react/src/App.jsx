import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import Register from './pages/Register';
import Login from './pages/Login';
import OnboardingPage from './pages/OnboardingPage';
import AdminInvite from './pages/AdminInvite';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;

  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <CssBaseline />
      <Router>
        <Container maxWidth="sm">
          <Routes>
            <Route path="/register/:token" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/onboarding-page"
              element={
                <PrivateRoute>
                  <OnboardingPage />
                </PrivateRoute>
              }
            />
            <Route 
              path="/admin-invite" 
              element={
                <PrivateRoute>
                  <AdminInvite />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;