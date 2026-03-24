import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, TextField, Button,
  Alert, CircularProgress, Paper
} from '@mui/material'
import LockResetIcon from '@mui/icons-material/LockReset'
import { resetPasswordAPI } from '~/apis'
import { toast } from 'react-toastify'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    if (!token) {
      setError('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.')
      setValidating(false)
    } else {
      setValidating(false)
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate passwords
    if (!newPassword || newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    setLoading(true)

    try {
      await resetPasswordAPI(token, newPassword)
      setSuccess(true)
      toast.success('Đặt lại mật khẩu thành công!')
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Đặt lại mật khẩu thất bại.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress color="error" />
      </Box>
    )
  }

  if (success) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <LockResetIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" color="success.main" gutterBottom>
              Thành công!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Mật khẩu của bạn đã được đặt lại thành công.
            </Typography>
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ fontWeight: 'bold' }}
            >
              Đăng nhập ngay
            </Button>
          </Paper>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <LockResetIcon sx={{ fontSize: 60, color: 'error.main', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Đặt lại mật khẩu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nhập mật khẩu mới cho tài khoản của bạn
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Mật khẩu mới"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Xác nhận mật khẩu mới"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              disabled={loading || !token}
              sx={{ fontWeight: 'bold', py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Đặt lại mật khẩu'}
            </Button>
          </form>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
            Đã nhớ mật khẩu?{' '}
            <Button color="error" onClick={() => navigate('/login')}>
              Đăng nhập
            </Button>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default ResetPassword
