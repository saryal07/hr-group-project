import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Assignment as ReportIcon,
  AccountCircle as AccountIcon,
  ExitToApp as LogoutIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  const navItems = [
    {
      title: 'Personal Information',
      path: '/employee/personal-info',
      icon: <AccountIcon sx={{ mr: 1 }} />,
    },
    {
      title: 'Visa Status Management',
      path: '/employee/visa-status',
      icon: <DashboardIcon sx={{ mr: 1 }} />,
    },
    {
      title: 'Housing',
      path: '/employee/housing',
      icon: <ReportIcon sx={{ mr: 1 }} />,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#000000',
        boxShadow: 'none',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Toolbar>
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          component={Link}
          to="/employee/dashboard"
          sx={{
            flexGrow: 0,
            textDecoration: 'none',
            color: 'white',
            fontWeight: 'bold',
            mr: 4,
          }}
        >
          HR Portal
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color="inherit"
              sx={{
                backgroundColor: isActive(item.path)
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'transparent',
                borderRadius: 1,
                px: 2,
                py: 1,
                textTransform: 'none',
                fontWeight: isActive(item.path) ? 'bold' : 'normal',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              {item.title}
            </Button>
          ))}
        </Box>

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="body2"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Welcome, {user?.username}
          </Typography>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: '#ffffff',
                color: '#000000',
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
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
            <MenuItem onClick={handleClose}>
              <AccountIcon sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
