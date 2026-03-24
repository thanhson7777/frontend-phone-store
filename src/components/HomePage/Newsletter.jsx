import { useState } from 'react'
import { Box, Container, Typography, TextField, Button, Snackbar, Alert } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import EmailIcon from '@mui/icons-material/Email'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setSnackbarMessage('Vui lòng nhập địa chỉ email hợp lệ!')
      setSnackbarSeverity('error')
      setOpenSnackbar(true)
      return
    }

    setLoading(true)

    // Mock API call - thực tế sẽ gọi API để lưu email
    setTimeout(() => {
      setLoading(false)
      setSnackbarMessage('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi thông tin ưu đãi qua email.')
      setSnackbarSeverity('success')
      setOpenSnackbar(true)
      setEmail('')
    }, 1000)
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 50%, #b71c1c 100%)',
        py: 6,
        mb: 4
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          {/* Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}
          >
            <EmailIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 2 }}
          >
            Đăng Ký Nhận Tin
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{ mb: 3, opacity: 0.9, maxWidth: 500, mx: 'auto' }}
          >
            Đăng ký ngay để nhận thông tin về các sản phẩm mới, khuyến mãi đặc biệt và ưu đãi hấp dẫn!
          </Typography>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              gap: 2,
              maxWidth: 500,
              mx: 'auto',
              flexDirection: { xs: 'column', sm: 'row' }
            }}
          >
            <TextField
              type="email"
              placeholder="Nhập địa chỉ email của bạn..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              fullWidth
              sx={{
                bgcolor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              endIcon={loading ? null : <SendIcon />}
              sx={{
                bgcolor: '#333',
                color: 'white',
                px: 4,
                py: { xs: 1.5, sm: 0 },
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                '&:hover': {
                  bgcolor: '#1a1a1a'
                },
                minWidth: { sm: 140 }
              }}
            >
              {loading ? 'Đang gửi...' : 'Đăng ký'}
            </Button>
          </Box>

          {/* Note */}
          <Typography
            variant="caption"
            sx={{ display: 'block', mt: 2, opacity: 0.7 }}
          >
            * Chúng tôi cam kết không gửi email spam. Bạn có thể hủy đăng ký bất kỳ lúc nào.
          </Typography>
        </Box>
      </Container>

      {/* Snackbar notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Newsletter
