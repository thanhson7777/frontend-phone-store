import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Header from '~/components/Header/Header'
import Footer from '~/components/Footer/Footer'

function MainLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Thanh điều hướng ở trên cùng */}
      <Header />

      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5', pb: 5 }}>
        <Outlet />
      </Box>

      {/* Footer ở dưới đáy */}
      <Footer />
    </Box>
  )
}

export default MainLayout