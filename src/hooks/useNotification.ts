import { useEffect } from 'react';
import { useGym } from './useGym';
import { isSunday, format } from 'date-fns';

export const useNotification = () => {
  const { gymDays } = useGym();
  
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  // Check for notifications at startup
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Check for daily attendance notification
  useEffect(() => {
    const today = new Date();
    
    // Don't send notifications on Sunday
    if (isSunday(today)) {
      return;
    }
    
    // Check if user has already marked attendance for today
    const todayFormatted = format(today, 'yyyy-MM-dd');
    const hasMarkedToday = gymDays.some(
      day => format(new Date(day.date), 'yyyy-MM-dd') === todayFormatted
    );
    
    if (!hasMarkedToday) {
      // Set notification for 8 PM if attendance isn't marked
      const notificationTime = new Date();
      notificationTime.setHours(20, 0, 0, 0);
      
      const now = new Date();
      
      if (now.getHours() < 20) {
        const timeUntilNotification = notificationTime.getTime() - now.getTime();
        
        const notificationTimer = setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification('Gym Attendance Reminder', {
              body: "Don't forget to log your gym attendance for today!",
            });
          }
        }, timeUntilNotification);
        
        return () => clearTimeout(notificationTimer);
      }
    }
  }, [gymDays]);

  return {
    requestNotificationPermission
  };
}; 