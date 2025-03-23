import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const SplashScreen: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: theme => "#000",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: `${pulse} 2s infinite ease-in-out`
        }}
      >
        <FitnessCenterIcon 
          sx={{ 
            fontSize: 100, 
            color: 'white',
            mb: 2 
          }} 
        />
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            color: 'white',
            fontWeight: 'bold',
            mb: 4
          }}
        >
          Gym Streak
        </Typography>
        <CircularProgress 
          size={40} 
          thickness={4} 
          sx={{ 
            color: 'white' 
          }} 
        />
      </Box>
    </Box>
  );
};

export default SplashScreen; 