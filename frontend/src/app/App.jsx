import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import AppRoutes from '../app/routes';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


function App() {
  return (
    <AuthProvider>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;