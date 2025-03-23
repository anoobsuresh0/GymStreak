import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
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
        backgroundColor: "#000",
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
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            color: 'white',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            mb: 4,
            fontFamily: "'Montserrat', sans-serif",
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