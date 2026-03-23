import React from 'react';
import { Box } from '@mui/material';

const StaggerItem = ({ children, index = 0, delayStep = 0.1, sx, ...props }) => {
  const delay = index * delayStep;

  return (
    <Box
      {...props} // Repassa qualquer outra propriedade (className, onClick, etc)
      sx={{
        opacity: 0,
        animation: `fadeSlideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
        animationDelay: `${delay}s`,
        '@keyframes fadeSlideUp': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        ...sx, // <-- A MÁGICA: Junta a animação com qualquer CSS que você passar de fora!
      }}
    >
      {children}
    </Box>
  );
};

export default StaggerItem;