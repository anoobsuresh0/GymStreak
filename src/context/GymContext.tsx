import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { addDays, isAfter, isBefore, isSunday, format } from 'date-fns';

// Define types
export interface GymDay {
  date: Date;
  attended: boolean;
}

interface PlanInfo {
  startDate: Date;
  duration: number; // in months
  endDate: Date;
}

interface GymContextType {
  gymDays: GymDay[];
  markAttendance: (date: Date, attended: boolean) => void;
  attendedCount: number;
  missedCount: number;
  planInfo: PlanInfo | null;
  setPlanInfo: (info: PlanInfo) => void;
  streak: number;
  attendanceRate: number;
}

export const GymContext = createContext<GymContextType>({
  gymDays: [],
  markAttendance: () => {},
  attendedCount: 0,
  missedCount: 0,
  planInfo: null,
  setPlanInfo: () => {},
  streak: 0,
  attendanceRate: 0,
});

interface GymProviderProps {
  children: ReactNode;
}

export const GymProvider: React.FC<GymProviderProps> = ({ children }) => {
  // Load data from localStorage if available
  const [gymDays, setGymDays] = useState<GymDay[]>(() => {
    const savedDays = localStorage.getItem('gymDays');
    if (savedDays) {
      return JSON.parse(savedDays).map((day: any) => ({
        ...day,
        date: new Date(day.date),
      }));
    }
    return [];
  });

  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(() => {
    const savedPlan = localStorage.getItem('planInfo');
    if (savedPlan) {
      const parsedPlan = JSON.parse(savedPlan);
      return {
        ...parsedPlan,
        startDate: new Date(parsedPlan.startDate),
        endDate: new Date(parsedPlan.endDate),
      };
    }
    return null;
  });

  // Calculate metrics
  const attendedCount = gymDays.filter(day => day.attended).length;
  const missedCount = gymDays.filter(day => !day.attended && !isSunday(new Date(day.date))).length;
  
  // Calculate current streak
  const calculateStreak = (): number => {
    let currentStreak = 0;
    let sortedDays = [...gymDays].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    for (let i = 0; i < sortedDays.length; i++) {
      if (sortedDays[i].attended && !isSunday(new Date(sortedDays[i].date))) {
        currentStreak++;
      } else if (!isSunday(new Date(sortedDays[i].date))) {
        break;
      }
    }
    
    return currentStreak;
  };

  const streak = calculateStreak();
  
  // Calculate attendance rate (excluding Sundays)
  const calculateAttendanceRate = (): number => {
    const totalPossibleDays = gymDays.filter(day => !isSunday(new Date(day.date))).length;
    return totalPossibleDays > 0 ? (attendedCount / totalPossibleDays) * 100 : 0;
  };
  
  const attendanceRate = calculateAttendanceRate();

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gymDays', JSON.stringify(gymDays));
  }, [gymDays]);

  useEffect(() => {
    if (planInfo) {
      localStorage.setItem('planInfo', JSON.stringify(planInfo));
    }
  }, [planInfo]);

  // Mark attendance for a specific date
  const markAttendance = (date: Date, attended: boolean) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const existingDayIndex = gymDays.findIndex(
      day => format(new Date(day.date), 'yyyy-MM-dd') === formattedDate
    );

    if (existingDayIndex >= 0) {
      // Update existing record
      const updatedDays = [...gymDays];
      updatedDays[existingDayIndex] = { date, attended };
      setGymDays(updatedDays);
    } else {
      // Add new record
      setGymDays([...gymDays, { date, attended }]);
    }
  };

  // Check for plan expiration and send notification
  useEffect(() => {
    if (planInfo && isAfter(new Date(), planInfo.endDate)) {
      // Plan has expired
      if (Notification.permission === 'granted') {
        new Notification('Gym Plan Expired', {
          body: 'Your gym membership plan has expired. Time to renew!',
        });
      }
    } else if (planInfo) {
      const thirtyDaysBefore = addDays(planInfo.endDate, -30);
      const sevenDaysBefore = addDays(planInfo.endDate, -7);
      const today = new Date();
      
      if (isAfter(today, thirtyDaysBefore) && isBefore(today, sevenDaysBefore)) {
        // 30 days before expiration
        if (Notification.permission === 'granted') {
          new Notification('Gym Plan Expiring Soon', {
            body: 'Your gym membership will expire in 30 days.',
          });
        }
      } else if (isAfter(today, sevenDaysBefore) && isBefore(today, planInfo.endDate)) {
        // 7 days before expiration
        if (Notification.permission === 'granted') {
          new Notification('Gym Plan Expiring Soon', {
            body: 'Your gym membership will expire in 7 days.',
          });
        }
      }
    }
  }, [planInfo]);

  return (
    <GymContext.Provider
      value={{
        gymDays,
        markAttendance,
        attendedCount,
        missedCount,
        planInfo,
        setPlanInfo,
        streak,
        attendanceRate,
      }}
    >
      {children}
    </GymContext.Provider>
  );
}; 