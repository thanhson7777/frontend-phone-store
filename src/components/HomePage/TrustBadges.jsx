import { Box, Container, Grid, Typography } from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import CreditCardIcon from '@mui/icons-material/CreditCard'

const trustItems = [
  {
    icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
    title: 'Miễn phí vận chuyển',
    description: 'Giao hàng miễn phí toàn quốc'
  },
  {
    icon: <AutorenewIcon sx={{ fontSize: 40 }} />,
    title: '7 ngày đổi trả',
    description: 'Đổi trả trong 7 ngày nếu lỗi'
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
    title: 'Hàng chính hãng',
    description: 'Cam kết 100% chính hãng'
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
    title: 'Hỗ trợ 24/7',
    description: 'Tư vấn hỗ trợ mọi lúc'
  },
  {
    icon: <CreditCardIcon sx={{ fontSize: 40 }} />,
    title: 'Thanh toán an toàn',
    description: 'Bảo mật thanh toán tuyệt đối'
  }
]

function TrustBadges() {
  return (
    <Box sx={{ bgcolor: 'white', py: 3, mb: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="center">
          {trustItems.map((item, index) => (
            <Grid item xs={6} sm={4} md={2.4} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 2,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  '&:hover': {
                    bgcolor: '#fff5f5',
                    transform: 'translateY(-3px)',
                    '& .icon': {
                      color: 'error.main',
                      transform: 'scale(1.1)'
                    }
                  }
                }}
              >
                <Box
                  className="icon"
                  sx={{
                    color: 'error.light',
                    mb: 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ mb: 0.5, fontSize: '0.9rem' }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem' }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default TrustBadges
