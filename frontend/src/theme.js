import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4B49AC',
      light: '#7DA0FA',
      dark: '#7978E9',
    },
    secondary: {
      main: '#98BDF',
      light: '#98BDF',
      dark: '#7978E9',
    },
    error: {
      main: '#F3797E',
      light: '#F3797E',
    },
    background: {
      default: '#f4f5fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2B2B2B',
      secondary: '#707275',
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          color: '#2B2B2B',
          '& .MuiListItemIcon-root': {
            color: '#2B2B2B',
          },
          '& .MuiListItemText-root': {
            color: '#2B2B2B',
          },
          '& .MuiListItemButton-root:hover': {
            backgroundColor: 'rgba(75, 73, 172, 0.08)',
          },
          '& .MuiListItemButton-root.Mui-selected': {
            backgroundColor: 'rgba(75, 73, 172, 0.12)',
            '& .MuiListItemIcon-root': {
              color: '#4B49AC',
            },
            '& .MuiListItemText-root': {
              color: '#4B49AC',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#4B49AC',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(75, 73, 172, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(75, 73, 172, 0.12)',
            },
            '& .MuiListItemIcon-root': {
              color: '#4B49AC',
            },
            '& .MuiListItemText-root': {
              color: '#4B49AC',
            },
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h4: {
          color: '#2B2B2B',
          fontWeight: 600,
        },
        h6: {
          color: '#2B2B2B',
          fontWeight: 600,
        },
        subtitle1: {
          color: '#707275',
        },
        subtitle2: {
          color: '#2B2B2B',
          fontWeight: 500,
        }
      }
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
});

// Custom gradients
export const gradients = {
  primary: 'linear-gradient(135deg, #4B49AC 0%, #7DA0FA 100%)',
  secondary: 'linear-gradient(135deg, #98BDF 0%, #7978E9 100%)',
  error: 'linear-gradient(135deg, #F3797E 0%, #F3797E 100%)',
}; 