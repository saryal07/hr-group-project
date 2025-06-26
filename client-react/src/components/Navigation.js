import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          HR Employee Portal
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/personal-information')}
            sx={{
              backgroundColor: isActive('/personal-information') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            Personal Information
          </Button>
          
          <Button
            color="inherit"
            onClick={() => navigate('/housing')}
            sx={{
              backgroundColor: isActive('/housing') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
            }}
          >
            Housing
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 