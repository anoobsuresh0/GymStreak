import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { addMonths, format } from 'date-fns';
import { useGym } from '../hooks/useGym';
import { useNotification } from '../hooks/useNotification';

const Settings: React.FC = () => {
  const { planInfo, setPlanInfo } = useGym();
  const { requestNotificationPermission } = useNotification();
  
  // Initialize form state
  const [startDate, setStartDate] = useState<Date | null>(
    planInfo ? new Date(planInfo.startDate) : new Date()
  );
  const [duration, setDuration] = useState<number>(
    planInfo ? planInfo.duration : 3
  );
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(
    Notification.permission === 'granted'
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Handle form submission
  const handleSavePlan = () => {
    if (!startDate) {
      setSnackbarMessage('Please select a start date');
      setSnackbarOpen(true);
      return;
    }
    
    const endDate = addMonths(startDate, duration);
    
    setPlanInfo({
      startDate,
      duration,
      endDate,
    });
    
    setSnackbarMessage('Membership plan saved successfully');
    setSnackbarOpen(true);
  };
  
  // Handle notification toggle
  const handleNotificationToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const permissionGranted = await requestNotificationPermission();
      setNotificationEnabled(permissionGranted);
      
      if (permissionGranted) {
        setSnackbarMessage('Notifications enabled');
      } else {
        setSnackbarMessage('Notification permission denied');
      }
      setSnackbarOpen(true);
    }
  };
  
  // Handle date change
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(new Date(event.target.value));
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom align="center">
          Settings
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Gym Membership Plan
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Stack spacing={3}>
            <TextField
              label="Plan Start Date"
              type="date"
              value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
              onChange={handleDateChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            
            <FormControl fullWidth>
              <InputLabel id="duration-label">Plan Duration</InputLabel>
              <Select
                labelId="duration-label"
                value={duration}
                label="Plan Duration"
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <MenuItem value={1}>1 Month</MenuItem>
                <MenuItem value={3}>3 Months</MenuItem>
                <MenuItem value={6}>6 Months</MenuItem>
                <MenuItem value={12}>12 Months</MenuItem>
              </Select>
            </FormControl>
            
            {startDate && (
              <Alert severity="info">
                Your membership will expire on {format(addMonths(startDate, duration), 'MMM d, yyyy')}
              </Alert>
            )}
            
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSavePlan}
              fullWidth
              size="large"
            >
              Save Plan Details
            </Button>
          </Stack>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            App Settings
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Stack spacing={3}>
            <FormControlLabel
              control={
                <Switch 
                  checked={notificationEnabled}
                  onChange={handleNotificationToggle}
                />
              }
              label="Enable Notifications"
            />
            
            <Typography variant="body2" color="text.secondary">
              Notifications will remind you to track your gym attendance and alert you about plan expiration.
            </Typography>
            
            <Divider />
            
            <Typography variant="body2" align="center">
              GymStreak v1.0.0
            </Typography>
          </Stack>
        </Paper>
      </Box>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default Settings; 