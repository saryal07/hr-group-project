import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import * as MUI from '@mui/material';
import { Assignment, Home } from '@mui/icons-material';
import './App.css';
import { VisaStatusManagementPage } from './features/visa-status-management/pages';

function App() {
  return (
    <Router>
      <MUI.Box sx={{ flexGrow: 1 }}>
        {/* Navigation Bar */}
        <MUI.AppBar position="static">
          <MUI.Toolbar>
            <MUI.Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              HR Onboarding Portal
            </MUI.Typography>
            <MUI.Button 
              color="inherit" 
              component={Link} 
              to="/"
              startIcon={<Home />}
            >
              Home
            </MUI.Button>
            <MUI.Button 
              color="inherit" 
              component={Link} 
              to="/visa-status"
              startIcon={<Assignment />}
            >
              Visa Status
            </MUI.Button>
          </MUI.Toolbar>
        </MUI.AppBar>

        {/* Routes */}
        <Routes>
          <Route path="/visa-status" element={<VisaStatusManagementPage />} />
          <Route path="/" element={
            <MUI.Container maxWidth="md">
              <MUI.Box my={4} textAlign="center">
                <MUI.Typography variant="h3" component="h1" gutterBottom>
                  Welcome to HR Onboarding Portal
                </MUI.Typography>
                <MUI.Typography variant="h6" color="text.secondary" paragraph>
                  Manage your employee onboarding process
                </MUI.Typography>
                
                <MUI.Box mt={4}>
                  <MUI.Grid container spacing={3} justifyContent="center">
                    <MUI.Grid>
                      <MUI.Card sx={{ minWidth: 275, textAlign: 'center' }}>
                        <MUI.CardContent>
                          <Assignment sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                          <MUI.Typography variant="h5" component="h2" gutterBottom>
                            Visa Status Management
                          </MUI.Typography>
                          <MUI.Typography variant="body2" color="text.secondary" paragraph>
                            Track and manage your OPT visa workflow documents
                          </MUI.Typography>
                          <MUI.Button 
                            variant="contained" 
                            component={Link} 
                            to="/visa-status"
                            size="large"
                          >
                            Go to Visa Status
                          </MUI.Button>
                        </MUI.CardContent>
                      </MUI.Card>
                    </MUI.Grid>
                  </MUI.Grid>
                </MUI.Box>
              </MUI.Box>
            </MUI.Container>
          } />
        </Routes>
      </MUI.Box>
    </Router>
  );
}

export default App;
