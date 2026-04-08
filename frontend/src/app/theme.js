import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      // Light: Vermelho Fatec | Dark: Cinza Chumbo Escuro
      main: mode === 'light' ? '#9e1b1f' : '#272727', 
      dark: mode === 'light' ? '#7c1417' : '#121212',
    },
    background: {
      // Fundo externo de toda a tela
      default: mode === 'light' ? '#f4f6f8' : '#0a0a0a', 
      // Fundo dos Cards, Modais e Tabelas
      paper: mode === 'light' ? '#ffffff' : '#141414',  
      eternity: mode === 'light' ? '#FFFFFF': '#ffffffee', // Um branco suave para elementos que precisam de destaque sutil no dark
    },
    text: {
      primary: mode === 'light' ? '#111111' : '#f5f5f5',
      secondary: mode === 'light' ? '#777777' : '#aaaaaa',
    },
    custom: {
      headerBg: mode === 'light' ? '#ffffff' : '#1c1c1c', // Dá um contraste sutil em relação ao fundo #0a0a0a
      status: {
        aprovado:  { bg: mode === 'light' ? '#e8f5e9' : 'rgba(46, 125, 50, 0.15)',  text: mode === 'light' ? '#2e7d32' : '#81c784' },
        pendente:  { bg: mode === 'light' ? '#fff3e0' : 'rgba(237, 108, 2, 0.15)', text: mode === 'light' ? '#ed6c02' : '#ffb74d' },
        reprovado: { bg: mode === 'light' ? '#ffebee' : 'rgba(211, 47, 47, 0.15)', text: mode === 'light' ? '#c62828' : '#e57373' },
        default:   { bg: mode === 'light' ? '#f5f5f5' : 'rgba(255, 255, 255, 0.05)',text: mode === 'light' ? '#757575' : '#aaaaaa' }
      }
  },
  sectionTitle: mode === 'light' ? '#9e1b1f' : '#f5f5f5',
},
  
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'light' ? '#dfdfdf' : '#0a0a0a',
          color: mode === 'light' ? '#111111' : '#f5f5f5',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          // Scrollbar cinza no dark, vermelha no light
          backgroundColor: mode === 'light' ? 'rgba(158, 27, 31, 0.4)' : '#333333',
          borderRadius: '8px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          height: '45px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          // Garante que a linha divisória da tabela fique suave no escuro
          borderBottom: `1px solid ${mode === 'light' ? '#e0e0e0' : '#333333'}`,
        },
        head: {
          fontWeight: 'bold',
          color: mode === 'light' ? '#111111' : '#f5f5f5',
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
        },
      },
    },
  },
});