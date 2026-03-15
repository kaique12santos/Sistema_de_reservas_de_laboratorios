import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#9e1b1f', // Vermelho Institucional Fatec/CPS
      dark: '#7c1417', // Vermelho Hover
    },
    background: {
      default: '#dfdfdf', // Fundo externo da tela
      paper: '#f5f5f5',   // Fundo interno dos modais/forms
    },
    text: {
      secondary: '#777777', // Cor para os labels e rodapé
    }
  },
  shape: {
    borderRadius: 12, // Borda padrão que ele usou para inputs e botões
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Criamos um padrão customizado para aqueles títulos em cima dos inputs
    inputLabel: {
      fontSize: '12px',
      letterSpacing: '2px',
      fontWeight: 'normal',
      color: '#777777',
      textTransform: 'uppercase',
    }
  },
  components: {
    // Sobrescrevemos o botão para sempre ser gordinho e com a fonte em negrito
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          height: '45px',
        },
      },
    },
    // Sobrescrevemos os TextFields para sempre terem fundo branco
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
      },
    },
  },
});

export default theme;