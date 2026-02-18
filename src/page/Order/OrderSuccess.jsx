import { Box, Button, Container, Typography, Paper } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { Link, useLocation } from 'react-router-dom'

function OrderSuccess() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  // VD với MoMo: Nếu giao dịch thành công thì resultCode = 0. Nếu huỷ hoặc lỗi thì khác 0
  // VD với VNPay: Giao dịch thành công thì vnp_ResponseCode = '00'
  const momoResultCode = searchParams.get('resultCode')
  const isFailed = momoResultCode !== null && momoResultCode !== '0'

  return (
    <Container maxWidth="sm" sx={{ mt: 10, mb: 10 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, textAlign: 'center', borderRadius: 3 }}>

        {/* NẾU ĐẶT HÀNG / THANH TOÁN THÀNH CÔNG */}
        {!isFailed ? (
          <>
            <CheckCircleOutlineIcon sx={{ fontSize: 90, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom color="success.main">
              Đặt hàng thành công!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
              Cảm ơn bạn đã tin tưởng và mua sắm tại cửa hàng. <br />
              Đơn hàng của bạn đang được hệ thống xử lý và sẽ sớm được giao đến tay bạn.
            </Typography>
          </>
        ) : (
          /* NẾU THANH TOÁN ONLINE BỊ LỖI HOẶC KHÁCH HUỶ GIAO DỊCH */
          <>
            <ErrorOutlineIcon sx={{ fontSize: 90, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom color="error.main">
              Thanh toán thất bại!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
              Rất tiếc, giao dịch thanh toán của fen chưa được hoàn tất hoặc đã bị huỷ. <br />
              Vui lòng kiểm tra lại số dư hoặc thử phương thức thanh toán khác.
            </Typography>
          </>
        )}

        {/* CỤM NÚT ĐIỀU HƯỚNG */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            color="error"
            size="large"
            startIcon={<HomeOutlinedIcon />}
            sx={{ fontWeight: 'bold', py: 1.5, px: 3 }}
          >
            Về trang chủ
          </Button>

          <Button
            component={Link}
            to="/user/orders" // Đường dẫn tới trang Quản lý đơn hàng của User
            variant="contained"
            color="error"
            size="large"
            startIcon={<ShoppingBagOutlinedIcon />}
            sx={{ fontWeight: 'bold', py: 1.5, px: 3 }}
          >
            Xem đơn hàng
          </Button>
        </Box>

      </Paper>
    </Container>
  )
}

export default OrderSuccess