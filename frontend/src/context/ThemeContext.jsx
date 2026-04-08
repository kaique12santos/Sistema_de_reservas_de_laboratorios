import React, { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 👇 IMPORTA A FUNÇÃO DO SEU ARQUIVO DE IDENTIDADE VISUAL
import { getAppTheme } from '../app/theme'; 

const ThemeContext = createContext();

export const useAppTheme = () => useContext(ThemeContext);

export const AppThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> 
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};