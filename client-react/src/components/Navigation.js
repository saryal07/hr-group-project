import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Person,
  Assignment,
  Home,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const handleProfile = () => {
    navigate('/personal-information'); // Use actual route
    handleClose();
  };

  // Use ACTUAL routes that exist in App.jsx
  const navItems = [
    {
      title: 'Personal Information',
      path: '/personal-information', // ✅ Exists in App.jsx
      icon: <Person sx={{ mr: 1 }} />,
    },
    {
      title: 'Visa Status Management',
      path: '/onboarding-page', // ✅ Exists in App.jsx
      icon: <Assignment sx={{ mr: 1 }} />,
    },
    {
      title: 'Housing',
      path: '/housing', // ✅ Exists in App.jsx
      icon: <Home sx={{ mr: 1 }} />,
    },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Brand with dashboard link */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 },
          }}
          onClick={() => navigate('/home')}
        >
          HR Employee Portal
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Navigation items with CORRECT routes */}
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: isActive(item.path)
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'transparent',
              }}
            >
              {item.title}
            </Button>
          ))}

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              {user?.firstName || user?.username || 'User'}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>
                <AccountCircle sx={{ mr: 1 }} />
                View Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
