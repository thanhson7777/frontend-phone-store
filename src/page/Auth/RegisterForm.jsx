import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Avatar,
  Typography,
  Card as MuiCard,
  TextField,
  Zoom,
  useTheme
} from '@mui/material'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useForm } from 'react-hook-form'
import {
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
  PASSWORD_CONFIRMATION_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { registerUserAPI } from '~/apis'
import { toast } from 'react-toastify'

function RegisterForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const navigate = useNavigate()
  const theme = useTheme()

  const submitRegister = (data) => {
    const { email, password } = data
    toast.promise(
      registerUserAPI({ email, password }),
      { pending: 'Đang xử lý đăng ký...' }
    ).then((res) => {
      navigate(`/login?registeredEmail=${data.email}`)
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
          {/* Header của Form */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{
              m: 1,
              bgcolor: 'linear-gradient(45deg, #d32f2f, #f44336)',
              width: 56,
              height: 56
            }}>
              <AppRegistrationIcon fontSize="large" />
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
              ĐĂNG KÝ
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(submitRegister)} sx={{ mt: 1 }}>

            {/* Field Email */}
            <TextField
              fullWidth
              autoFocus
              label="Email"
              variant="outlined"
              margin="normal"
              color="error"
              helperText="Nhập địa chỉ email hợp lệ"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': { borderColor: theme.palette.error.main },
                  '&.Mui-focused fieldset': { borderWidth: 2 }
                }
              }}
              {...register('email', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
              })}
              error={!!errors.email}
              aria-label="Email input"
            />
            <FieldErrorAlert errors={errors} fieldName={'email'} />

            {/* Field Password */}
            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              variant="outlined"
              margin="normal"
              color="error"
              helperText="Mật khẩu ít nhất 6 ký tự, bao gồm chữ và số"
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

            {/* Field Xác nhận Password */}
            <TextField
              fullWidth
              label="Xác nhận mật khẩu"
              type="password"
              variant="outlined"
              margin="normal"
              color="error"
              helperText="Nhập lại mật khẩu để xác nhận"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': { borderColor: theme.palette.error.main },
                  '&.Mui-focused fieldset': { borderWidth: 2 }
                }
              }}
              {...register('password_confirmation', {
                required: FIELD_REQUIRED_MESSAGE,
                validate: (value) => value === watch('password') || PASSWORD_CONFIRMATION_MESSAGE
              })}
              error={!!errors.password_confirmation}
              aria-label="Confirm password input"
            />
            <FieldErrorAlert errors={errors} fieldName={'password_confirmation'} />

            {/* Nút Submit */}
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
              Tạo Tài Khoản
            </Button>

            {/* Link chuyển sang trang Đăng nhập*/}
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Link
                to="/login"
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
                Đã có tài khoản? Đăng nhập ngay! <ArrowForwardIcon sx={{ ml: 0.5, fontSize: 16 }} />
              </Link>
            </Box>

          </Box>
        </MuiCard>
      </Zoom>
    </Box>
  )
}

export default RegisterForm