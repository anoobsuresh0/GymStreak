import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Stack,
  Divider,
  Container,
  Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useGym } from '../hooks/useGym';
import { format, isSunday } from 'date-fns';

const Dashboard: React.FC = () => {
  const { 
    markAttendance, 
    gymDays, 
    attendedCount, 
    missedCount, 
    streak,
    planInfo 
  } = useGym();
  
  const today = new Date();
  const todayFormatted = format(today, 'yyyy-MM-dd');
  
  // Check if today's attendance is already marked
  const todayRecord = gymDays.find(
    day => format(new Date(day.date), 'yyyy-MM-dd') === todayFormatted
  );
  
  const isTodaySunday = isSunday(today);
  
  const handleAttendance = (attended: boolean) => {
    markAttendance(today, attended);
  };
  
  // Calculate days remaining in the plan
  const getDaysRemaining = () => {
    if (!planInfo) return null;
    
    const today = new Date();
    const endDate = new Date(planInfo.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  const daysRemaining = getDaysRemaining();

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom align="center">
          GymStreak
        </Typography>
        
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h2" component="h2" gutterBottom align="center">
            {format(today, 'EEEE, MMMM d, yyyy')}
          </Typography>
          
          {isTodaySunday ? (
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 2 }}>
              Today is your rest day. No gym scheduled for Sundays.
            </Typography>
          ) : todayRecord ? (
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body1">
                You've already marked your attendance for today.
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {todayRecord.attended ? (
                  <>
                    <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1" color="primary">You went to the gym</Typography>
                  </>
                ) : (
                  <>
                    <CancelIcon color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="body1" color="secondary">You missed the gym</Typography>
                  </>
                )}
              </Box>
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => handleAttendance(!todayRecord.attended)}
              >
                Change to {todayRecord.attended ? "Didn't go" : "Went"}
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                Did you go to the gym today?
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleAttendance(true)}
                  sx={{ px: 3, py: 1.5 }}
                >
                  Yes, I went
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large"
                  startIcon={<CancelIcon />}
                  onClick={() => handleAttendance(false)}
                  sx={{ px: 3, py: 1.5 }}
                >
                  No, I didn't
                </Button>
              </Stack>
            </Box>
          )}
        </Paper>
        
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Current Stats
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body1" color="text.secondary">Current Streak:</Typography>
                <Typography variant="body1" fontWeight="bold">{streak} days</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body1" color="text.secondary">Total Gym Days:</Typography>
                <Typography variant="body1" fontWeight="bold">{attendedCount}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1" color="text.secondary">Days Missed:</Typography>
                <Typography variant="body1" fontWeight="bold">{missedCount}</Typography>
              </Stack>
            </CardContent>
          </Card>
          
          {planInfo && (
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  Gym Membership
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body1" color="text.secondary">Plan Duration:</Typography>
                  <Typography variant="body1" fontWeight="bold">{planInfo.duration} months</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body1" color="text.secondary">Start Date:</Typography>
                  <Typography variant="body1" fontWeight="bold">{format(new Date(planInfo.startDate), 'MMM d, yyyy')}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body1" color="text.secondary">End Date:</Typography>
                  <Typography variant="body1" fontWeight="bold">{format(new Date(planInfo.endDate), 'MMM d, yyyy')}</Typography>
                </Stack>
                {daysRemaining !== null && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body1" color="text.secondary">Days Remaining:</Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="bold"
                      color={daysRemaining < 15 ? 'secondary.main' : 'primary.main'}
                    >
                      {daysRemaining} days
                    </Typography>
                  </Stack>
                )}
              </CardContent>
            </Card>
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default Dashboard; 