import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../utils/Toast'; 

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toastConfig, setToastConfig] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = useCallback((message, severity = 'success') => {
    setToastConfig({ open: true, message, severity });
  }, []);

  // Atalhos semânticos para facilitar a chamada nos componentes
  const showSuccess = useCallback((msg) => showToast(msg, 'success'), [showToast]);
  const showError   = useCallback((msg) => showToast(msg, 'error'), [showToast]);
  const showWarning = useCallback((msg) => showToast(msg, 'warning'), [showToast]);
  const showInfo    = useCallback((msg) => showToast(msg, 'info'), [showToast]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setToastConfig((prev) => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      
      {/* O Toast renderizado apenas UMA vez na raiz da aplicação */}
      <Toast 
        open={toastConfig.open} 
        handleClose={handleClose} 
        message={toastConfig.message} 
        severity={toastConfig.severity} 
      />
    </NotificationContext.Provider>
  );
}

// Hook customizado para facilitar o uso
export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de NotificationProvider');
  }
  return context;
}