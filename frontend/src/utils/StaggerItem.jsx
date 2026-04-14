import React from 'react';
import { Box } from '@mui/material';

const StaggerItem = ({ children, index = 0, delayStep = 0.1, sx, ...props }) => {
  const delay = index * delayStep;

  return (
    <Box
      {...props} 
      sx={{
        opacity: 0,
        animation: `fadeSlideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
        animationDelay: `${delay}s`,
        '@keyframes fadeSlideUp': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default StaggerItem;