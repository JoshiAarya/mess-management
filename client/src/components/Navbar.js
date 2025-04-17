import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  FaHome,
  FaUsers,
  FaClipboardCheck,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserSlash,
} from 'react-icons/fa';

const Navbar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
    { text: 'Manage Members', icon: <FaUsers />, path: '/members' },
    { text: 'Manage Attendance', icon: <FaClipboardCheck />, path: '/attendance' },
    { text: 'Exhausted Members', icon: <FaUserSlash />, path: '/exhausted-members' },
  ];

  const drawer = (
    <List>
      {menuItems.map((item) => (
        <ListItem
          button
          component={Link}
          to={item.path}
          key={item.text}
          selected={location.pathname === item.path}
          onClick={handleDrawerToggle}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.12)',
              },
            },
          }}
        >
          <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            sx={{
              color: location.pathname === item.path ? 'primary.main' : 'text.primary',
              fontWeight: location.pathname === item.path ? 'bold' : 'normal',
            }}
          />
        </ListItem>
      ))}
    </List>
  );

  const isActive = (path) => location.pathname === path;

  const NavButton = ({ to, icon, children }) => (
    <Button
      component={Link}
      to={to}
      color="inherit"
      startIcon={icon}
      sx={{
        mx: 1,
        color: 'inherit',
        fontWeight: isActive(to) ? 'bold' : 'normal',
        backgroundColor: isActive(to) ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        }
      }}
    >
      {children}
    </Button>
  );

  return (
    <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Mess Manager
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {menuItems.map((item) => (
              <NavButton key={item.text} to={item.path} icon={item.icon}>
                {item.text}
              </NavButton>
            ))}
          </Box>
        )}

        <Tooltip title="Logout">
          <IconButton
            color="inherit"
            onClick={logout}
            sx={{ ml: 2 }}
          >
            <FaSignOutAlt />
          </IconButton>
        </Tooltip>

        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ ml: 2 }}
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </IconButton>
        )}
      </Toolbar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 