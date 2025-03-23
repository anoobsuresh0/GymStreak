import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { useNotification } from './hooks/useNotification';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green
    },
    secondary: {
      main: '#f44336', // Red
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '1.8rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
  },
});

function App() {
  const [page, setPage] = useState('dashboard');
  
  // Initialize notifications
  useNotification();
  
  // Register service worker for PWA functionality
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(
          registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          err => {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  // Render the current page based on navigation state
  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard />;
      case 'calendar':
        return <Calendar />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ pb: 7, minHeight: '100vh' }}>
        {renderPage()}
        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={page}
            onChange={(_, newValue) => {
              setPage(newValue);
            }}
          >
            <BottomNavigationAction 
              label="Today" 
              value="dashboard" 
              icon={<FitnessCenterIcon />} 
            />
            <BottomNavigationAction 
              label="Calendar" 
              value="calendar" 
              icon={<CalendarMonthIcon />} 
            />
            <BottomNavigationAction 
              label="Analytics" 
              value="analytics" 
              icon={<BarChartIcon />} 
            />
            <BottomNavigationAction 
              label="Settings" 
              value="settings" 
              icon={<SettingsIcon />} 
            />
          </BottomNavigation>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;
