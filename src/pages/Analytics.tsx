import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Paper, Grid, Card, CardContent, Divider } from '@mui/material';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useGym } from '../hooks/useGym';
import { format, subDays, eachDayOfInterval, isSunday, startOfWeek, endOfWeek, getWeek } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics: React.FC = () => {
  const { gymDays, attendedCount, missedCount, attendanceRate } = useGym();
  const [weeklyData, setWeeklyData] = useState<{ labels: string[], datasets: any[] }>({
    labels: [],
    datasets: [],
  });
  const [monthlyData, setMonthlyData] = useState<{ labels: string[], datasets: any[] }>({
    labels: [],
    datasets: [],
  });

  // Prepare data for charts
  useEffect(() => {
    // Last 4 weeks data for line chart
    const today = new Date();
    const fourWeeksAgo = subDays(today, 28);
    
    // Create a range of all days in the last 4 weeks
    const dayRange = eachDayOfInterval({
      start: fourWeeksAgo,
      end: today,
    });
    
    // Group by week
    const weeks: { [key: string]: { attended: number; total: number } } = {};
    
    dayRange.forEach(day => {
      if (isSunday(day)) return; // Skip Sundays
      
      const weekStart = startOfWeek(day, { weekStartsOn: 1 }); // Week starts on Monday
      const weekEnd = endOfWeek(day, { weekStartsOn: 1 });
      const weekLabel = `W${getWeek(day)}`;
      
      if (!weeks[weekLabel]) {
        weeks[weekLabel] = { attended: 0, total: 0 };
      }
      
      const formattedDay = format(day, 'yyyy-MM-dd');
      const dayRecord = gymDays.find(
        gymDay => format(new Date(gymDay.date), 'yyyy-MM-dd') === formattedDay
      );
      
      if (dayRecord && dayRecord.attended) {
        weeks[weekLabel].attended += 1;
      }
      
      weeks[weekLabel].total += 1;
    });
    
    // Convert to chart data
    const weekLabels = Object.keys(weeks);
    const weekAttendanceData = weekLabels.map(week => 
      weeks[week].total > 0 ? (weeks[week].attended / weeks[week].total) * 100 : 0
    );
    
    setWeeklyData({
      labels: weekLabels,
      datasets: [
        {
          label: 'Weekly Attendance Rate (%)',
          data: weekAttendanceData,
          fill: false,
          backgroundColor: 'rgba(46, 125, 50, 0.2)',
          borderColor: 'rgba(46, 125, 50, 1)',
          tension: 0.4,
        },
      ],
    });
    
    // Monthly distribution data for doughnut chart
    setMonthlyData({
      labels: ['Attended', 'Missed'],
      datasets: [
        {
          data: [attendedCount, missedCount],
          backgroundColor: ['rgba(46, 125, 50, 0.6)', 'rgba(244, 67, 54, 0.6)'],
          borderColor: ['rgba(46, 125, 50, 1)', 'rgba(244, 67, 54, 1)'],
          borderWidth: 1,
        },
      ],
    });
    
  }, [gymDays, attendedCount, missedCount]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom align="center">
          Gym Analytics
        </Typography>
        
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Overall Performance
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Attendance Rate
                      </Typography>
                      <Typography variant="h4" component="div" color={attendanceRate >= 80 ? 'primary.main' : 'secondary.main'}>
                        {attendanceRate.toFixed(1)}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Total Sessions
                      </Typography>
                      <Typography variant="h4" component="div">
                        {attendedCount + missedCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Attended
                      </Typography>
                      <Typography variant="h4" component="div" color="primary.main">
                        {attendedCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Missed
                      </Typography>
                      <Typography variant="h4" component="div" color="secondary.main">
                        {missedCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          {/* Weekly Attendance Chart */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Weekly Attendance Trend
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 250 }}>
                {weeklyData.labels.length > 0 && (
                  <Line 
                    data={weeklyData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          title: {
                            display: true,
                            text: 'Attendance Rate (%)'
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          display: false
                        }
                      }
                    }}
                  />
                )}
              </Box>
            </Paper>
          </Grid>
          
          {/* Distribution Chart */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Attendance Distribution
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
                {monthlyData.labels.length > 0 && (
                  <Box sx={{ width: '70%', maxWidth: 250 }}>
                    <Doughnut 
                      data={monthlyData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }} 
                    />
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Analytics; 