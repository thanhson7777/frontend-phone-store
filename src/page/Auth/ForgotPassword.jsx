import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, TextField, Button,
  Alert, CircularProgress, Paper, Link
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import { forgotPasswordAPI } from '~/apis'
import { toast } from 'react-toastify'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!email || !email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.')
      return
    }

    setLoading(true)

    try {
      await forgotPasswordAPI(email)
      setSuccess(true)
      toast.success('Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra hộp thư của bạn.')
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Gửi email thất bại.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <EmailIcon sx={{ fontSize: 60, color: 'error.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Quên mật khẩu?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nhập địa chỉ email của bạn để nhận link đặt lại mật khẩu
            </Typography>
          </Box>

          {success ? (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra hộp thư của bạn (kể cả thư rác).
              </Alert>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={() => navigate('/login')}
                sx={{ fontWeight: 'bold', py: 1.5 }}
              >
                Quay lại đăng nhập
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                sx={{ mb: 3 }}
                required
              />

              <Button
                type="submit"
                variant="contained"
                color="error"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ fontWeight: 'bold', py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Gửi email đặt lại mật khẩu'}
              </Button>
            </form>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            Nhớ mật khẩu rồi?{' '}
            <Link component={RouterLink} to="/login" color="error.main" sx={{ fontWeight: 'bold' }}>
              Đăng nhập ngay
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default ForgotPassword
