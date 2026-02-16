import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'

function Logo() {
  return (
    <Box
      component={Link}
      to="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'white',
        gap: 1
      }}
    >
      <PhoneIphoneIcon sx={{ fontSize: 32 }} />
      <Typography variant="h6" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
        PHONE STORE
      </Typography>
    </Box>
  )
}

export default Logo