import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack
} from '@mui/material';
import Calendar from 'react-calendar';
import { format, isSunday } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useGym } from '../hooks/useGym';
import { GymDay } from '../context/GymContext';
import 'react-calendar/dist/Calendar.css';

// Custom CSS for calendar
const calendarStyles = {
  '.react-calendar': {
    width: '100%',
    maxWidth: '100%',
    background: 'white',
    border: '1px solid #a0a096',
    fontFamily: 'Arial, Helvetica, sans-serif',
    lineHeight: '1.125em',
    borderRadius: '8px',
    padding: '10px',
    margin: '0 auto',
  },
  '.react-calendar__tile': {
    height: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '10px 0',
  },
};

const CalendarPage: React.FC = () => {
  const { gymDays, markAttendance } = useGym();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleDateClick = (value: Date) => {
    // Don't allow editing Sundays
    if (isSunday(value)) {
      return;
    }
    
    setSelectedDate(value);
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDate(null);
  };
  
  const handleMarkAttendance = (attended: boolean) => {
    if (selectedDate) {
      markAttendance(selectedDate, attended);
      setDialogOpen(false);
      setSelectedDate(null);
    }
  };
  
  // Find gym day record for the selected date
  const findGymDayForDate = (date: Date | null): GymDay | undefined => {
    if (!date) return undefined;
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    return gymDays.find(
      day => format(new Date(day.date), 'yyyy-MM-dd') === formattedDate
    );
  };
  
  const selectedGymDay = findGymDayForDate(selectedDate);
  
  // Custom tile content for the calendar
  const tileContent = ({ date }: { date: Date }) => {
    // For Sundays, mark as rest day
    if (isSunday(date)) {
      return (
        <div style={{ fontSize: '0.65rem', marginTop: '4px', color: '#757575' }}>
          Rest Day
        </div>
      );
    }
    
    // Format date for comparison
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Find if there's a record for this date
    const dayRecord = gymDays.find(
      day => format(new Date(day.date), 'yyyy-MM-dd') === formattedDate
    );
    
    if (dayRecord) {
      return dayRecord.attended ? (
        <CheckCircleIcon 
          fontSize="small" 
          color="primary"
          sx={{ mt: 1 }}
        />
      ) : (
        <CancelIcon 
          fontSize="small" 
          color="secondary"
          sx={{ mt: 1 }}
        />
      );
    }
    
    return null;
  };
  
  // Custom tile class name for the calendar
  const tileClassName = ({ date }: { date: Date }) => {
    // For past dates that have no record (excluding Sundays)
    const today = new Date();
    const isPastDate = date < today && format(date, 'yyyy-MM-dd') !== format(today, 'yyyy-MM-dd');
    
    if (isPastDate && !isSunday(date)) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const hasDayRecord = gymDays.some(
        day => format(new Date(day.date), 'yyyy-MM-dd') === formattedDate
      );
      
      // If there's no record for a past date, apply a "missed" style
      if (!hasDayRecord) {
        return 'react-calendar__tile--missed';
      }
    }
    
    return null;
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom align="center">
          Gym Calendar
        </Typography>
        
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            borderRadius: 2,
            '.react-calendar__tile--missed abbr': {
              background: '#ffebee',
              display: 'inline-block',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              lineHeight: '30px',
            },
            '.react-calendar__tile--active': {
              background: '#d3e9d7',
              color: 'black',
            },
            '.react-calendar__tile--now': {
              background: '#fff9c4',
            },
            ...calendarStyles,
          }}
        >
          <Calendar 
            onClickDay={handleDateClick}
            tileContent={tileContent}
            tileClassName={tileClassName}
            showNeighboringMonth={false}
          />
        </Paper>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">Attended</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
            <CancelIcon color="secondary" sx={{ mr: 1 }} />
            <Typography variant="body2">Missed</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
              width: 16, 
              height: 16, 
              backgroundColor: '#ffebee', 
              borderRadius: '50%', 
              mr: 1 
            }} />
            <Typography variant="body2">No Record</Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Dialog for marking attendance */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </DialogTitle>
        <DialogContent>
          {selectedGymDay ? (
            <Typography>
              {selectedGymDay.attended 
                ? "You've marked that you went to the gym on this day." 
                : "You've marked that you didn't go to the gym on this day."}
            </Typography>
          ) : (
            <Typography>Mark your attendance for this day:</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={1} sx={{ p: 1 }}>
            <Button onClick={handleCloseDialog} variant="outlined">
              Cancel
            </Button>
            <Button 
              onClick={() => handleMarkAttendance(true)} 
              variant="contained" 
              color="primary"
              startIcon={<CheckCircleIcon />}
            >
              {selectedGymDay ? "Change to Attended" : "Attended"}
            </Button>
            <Button 
              onClick={() => handleMarkAttendance(false)} 
              variant="contained" 
              color="secondary"
              startIcon={<CancelIcon />}
            >
              {selectedGymDay ? "Change to Missed" : "Missed"}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CalendarPage; 