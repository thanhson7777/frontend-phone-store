import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Avatar,
  Typography,
  Card as MuiCard,
  TextField,
  Zoom,
  Alert,
  Fade,
  useTheme
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useForm } from 'react-hook-form'
import {
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginUserAPI } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'

function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()

  let [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')

  const { register, handleSubmit, formState: { errors } } = useForm()

  const submitLogIn = (data) => {
    const { email, password } = data
    toast.promise(
      dispatch(loginUserAPI({ email, password })),
      { pending: 'Đang đăng nhập...' }
    ).then(res => {
      if (!res.error) navigate('/')
    })
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
      padding: 2
    }}>
      {/* Hiệu ứng Zoom khi load trang */}
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard
          sx={{
            minWidth: { xs: 320, sm: 380 },
            maxWidth: 380,
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: `1px solid ${theme.palette.divider}`,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{
              m: 1,
              bgcolor: 'linear-gradient(45deg, #d32f2f, #f44336)',
              width: 56,
              height: 56
            }}>
              <LockIcon fontSize="large" />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                fontWeight: 700,
                color: theme.palette.error.main,
                textAlign: 'center',
                letterSpacing: 1
              }}
            >
              ĐĂNG NHẬP
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(submitLogIn)} sx={{ mt: 1 }}>

            {/* Cảnh báo từ URL Params (Nếu user vừa đăng ký hoặc verify xong) - Thêm Fade animation */}
            <Fade in={!!registeredEmail} timeout={500}>
              <Box>
                {registeredEmail && (
                  <Alert severity="info" sx={{ mb: 2, borderRadius: '8px' }} icon={<LockIcon />}>
                    Đăng ký thành công. Vui lòng check email: <b>{registeredEmail}</b>
                  </Alert>
                )}
              </Box>
            </Fade>
            <Fade in={!!verifiedEmail} timeout={500}>
              <Box>
                {verifiedEmail && (
                  <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }} icon={<LockIcon />}>
                    Xác thực email thành công. Vui lòng đăng nhập!
                  </Alert>
                )}
              </Box>
            </Fade>

            {/* Field Email */}
            <TextField
              fullWidth
              autoFocus
              label="Email"
              variant="outlined"
              margin="normal"
              color="error"
              helperText="Nhập địa chỉ email của bạn"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': { borderColor: theme.palette.error.main },
                  '&.Mui-focused fieldset': { borderWidth: 2 }
                }
              }}
              // Validate bằng React Hook Form
              {...register('email', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
              })}
              error={!!errors.email}
              aria-label="Email input"
            />
            {/* Component hiển thị lỗi (đã được import) */}
            <FieldErrorAlert errors={errors} fieldName={'email'} />

            {/* Field Password */}
            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              variant="outlined"
              margin="normal"
              color="error"
              helperText="Mật khẩu ít nhất 6 ký tự"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': { borderColor: theme.palette.error.main },
                  '&.Mui-focused fieldset': { borderWidth: 2 }
                }
              }}
              {...register('password', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: { value: PASSWORD_RULE, message: PASSWORD_RULE_MESSAGE }
              })}
              error={!!errors.password}
              aria-label="Password input"
            />
            <FieldErrorAlert errors={errors} fieldName={'password'} />

            {/* Nút Submit - Thêm gradient và hiệu ứng */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="error"
              size="large"
              sx={{
                mt: 3,
                mb: 2,
                fontWeight: 'bold',
                py: 1.5,
                borderRadius: '8px',
                background: 'linear-gradient(45deg, #d32f2f, #f44336)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 20px rgba(211, 47, 47, 0.3)'
                },
                '&.Mui-disabled': {
                  background: theme.palette.grey[400],
                  color: theme.palette.grey[600]
                }
              }}
              className="interceptor-loading"
              disabled={document.body.classList.contains('interceptor-loading')}
            >
              Đăng Nhập
            </Button>

            {/* Link chuyển sang trang Đăng ký */}
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Link
                to="/register"
                style={{
                  textDecoration: 'none',
                  color: theme.palette.error.main,
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'text-decoration 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Chưa có tài khoản? Đăng ký ngay! <ArrowForwardIcon sx={{ ml: 0.5, fontSize: 16 }} />
              </Link>
            </Box>

          </Box>
        </MuiCard>
      </Zoom>
    </Box>
  )
}

export default LoginForm