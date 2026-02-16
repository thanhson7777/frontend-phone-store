import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { cyan, deepOrange, orange, teal, red } from '@mui/material/colors'

// Tự định nghĩa một vài biến kích thước dùng chung cho toàn dự án
const APP_BAR_HEIGHT = '64px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT})`

// Create a theme instance.
const theme = extendTheme({
  // Custom biến của riêng bạn để dễ gọi lại trong component
  storeCustomVars: {
    appBarHeight: APP_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: red[500] },
        secondary: { main: deepOrange[500] }
      }
    },
    dark: {
      palette: {
        primary: { main: cyan[400] },
        secondary: { main: orange[400] }
      }
    }
  },
  typography: {
    // Thêm font chữ
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#a4b0be' // Đã sửa lại để không bị tàng hình ở Light mode
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '1px',
          '&:hover': { borderWidth: '1px' }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: '0.875rem' }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': { fontSize: '0.875rem' }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldset': { borderWidth: '1.5px !important' },
          '&:hover fieldset': { borderWidth: '1.75px !important' },
          '&.Mui-focused fieldset': { borderWidth: '1.75px !important' }
        }
      }
    }
  }
})

export default theme