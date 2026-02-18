import { useState, useEffect } from 'react'
import {
  Box, Container, Grid, Typography, TextField, Button,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
  Card, Divider, Paper
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

// Import Redux state
import { selectCurrentCarts } from '~/redux/carts/cartSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { createOrderAPI, getCouponsAPI } from '~/apis'
import { clearCurrentCarts } from '~/redux/carts/cartSlice'
import { use } from 'react'

// Giả lập danh sách Mã giảm giá (Sau này fen gọi API lấy list này)
// const MOCK_COUPONS = [
//   { _id: 'C1', code: 'GIAM100K', name: 'Giảm 100k cho đơn từ 10 Triệu', value: 100000 },
//   { _id: 'C2', code: 'FREESHIP', name: 'Miễn phí vận chuyển (Tối đa 50k)', value: 50000 }
// ]

function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cart = useSelector(selectCurrentCarts)
  const currentUser = useSelector(selectCurrentUser)

  // 1. Quản lý Form Thông tin giao hàng
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullname: currentUser?.fullname || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || '',
      note: ''
    }
  })

  // 2. Quản lý State Phương thức thanh toán & Coupon
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [selectedCoupon, setSelectedCoupon] = useState('')
  const [coupons, setCoupons] = useState([])

  // Tính toán lại giá tiền hiển thị trên UI
  const temporaryPrice = cart?.totalPrice || 0
  const activeCoupon = coupons.find(c => c._id === selectedCoupon)
  let discountAmount = 0
  if (activeCoupon?.discount) {
    if (activeCoupon.discount.type === 'FIXED') {
      discountAmount = activeCoupon.discount.value
    } else {
      discountAmount = (temporaryPrice * activeCoupon.discount.value) / 100
      if (activeCoupon.discount.maxAmount) {
        discountAmount = Math.min(discountAmount, activeCoupon.discount.maxAmount)
      }
    }
  }

  const finalPrice = Math.max(0, temporaryPrice - discountAmount)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
  }

  useEffect(() => {
    getCouponsAPI()
      .then(res => {
        console.log('res', res)
        const couponsData = res?.data?.coupons || res?.data || res?.coupons || res
        if (Array.isArray(couponsData)) {
          setCoupons(couponsData)
        } else {
          console.log('Dữ liệu không phải là mảng:', couponsData)
          setCoupons([])
        }

      })
      .catch(err => {
        console.log('Lỗi khi lấy coupons:', err)
      })
  }, [])

  // 3. Hàm Xử lý Đặt hàng (Bấm nút Chốt đơn)
  const onSubmitOrder = async (data) => {
    if (!cart?.products?.length) {
      toast.error('Giỏ hàng trống, không thể đặt hàng!')
      return
    }

    // Gói dữ liệu chuẩn bị gửi lên Backend
    const orderPayload = {
      shippingAddress: {
        fullname: data.fullname,
        phone: data.phone,
        address: data.address,
        note: data.note
      },
      paymentMethod: paymentMethod,
    }

    // Nếu có chọn mã giảm giá thì mới gắn vào Payload
    if (selectedCoupon) {
      orderPayload.couponId = selectedCoupon
    }

    try {
      // Dùng await thay vì .then() để code chạy từ trên xuống dưới một cách đồng bộ
      const response = await createOrderAPI(orderPayload)

      // Tùy vào setup Axios của fen, data có thể nằm trực tiếp ở response hoặc response.data
      const res = response?.data || response

      console.log('Order created:', res)
      toast.success('Đã tạo đơn hàng thành công!')

      dispatch(clearCurrentCarts())
      if (res?.paymentUrl) {
        // Nếu là MoMo / VNPay -> Backend trả về paymentUrl -> Đá khách sang đó
        window.location.href = res.paymentUrl
      } else {
        // Nếu là COD (Không có paymentUrl) -> Chuyển sang trang Cảm ơn
        navigate('/order-success')
      }

    } catch (error) {
      console.log('Lỗi đặt hàng:', error)
      toast.error('Có lỗi xảy ra khi đặt hàng, vui lòng thử lại!')
    }
  }

  if (!cart?.products?.length) {
    return <Typography sx={{ mt: 10, textAlign: 'center' }}>Giỏ hàng của bạn đang trống!</Typography>
  }

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h5" fontWeight="bold" textTransform="uppercase" sx={{ mb: 4 }}>
        Thanh toán đơn hàng
      </Typography>

      <form onSubmit={handleSubmit(onSubmitOrder)}>
        <Grid container spacing={4}>
          {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG & THANH TOÁN */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #eee', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Thông tin nhận hàng</Typography>

              <TextField
                fullWidth label="Họ và tên" sx={{ mb: 2 }}
                {...register('fullname', { required: 'Vui lòng nhập họ tên' })}
                error={!!errors.fullname} helperText={errors.fullname?.message}
              />
              <TextField
                fullWidth label="Số điện thoại" sx={{ mb: 2 }}
                {...register('phone', { required: 'Vui lòng nhập số điện thoại' })}
                error={!!errors.phone} helperText={errors.phone?.message}
              />
              <TextField
                fullWidth label="Địa chỉ giao hàng chi tiết" sx={{ mb: 2 }}
                {...register('address', { required: 'Vui lòng nhập địa chỉ' })}
                error={!!errors.address} helperText={errors.address?.message}
              />
              <TextField
                fullWidth label="Ghi chú đơn hàng (Tùy chọn)" multiline rows={3}
                {...register('note')}
              />
            </Paper>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid #eee', mb: 3 }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                  Mã giảm giá
                </FormLabel>
                <RadioGroup
                  value={selectedCoupon}
                  onChange={(e) => setSelectedCoupon(e.target.value)}
                >
                  <FormControlLabel value="" control={<Radio />} label="Không dùng mã giảm giá" />
                  {coupons.map(coupon => (
                    <FormControlLabel
                      key={coupon._id}
                      value={coupon._id}
                      control={<Radio color="error" />}
                      label={`${coupon.code}`}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid #eee' }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                  Phương thức thanh toán
                </FormLabel>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel value="COD" control={<Radio color="error" />} label="Thanh toán khi nhận hàng (COD)" />
                  <FormControlLabel value="MOMO" control={<Radio color="error" />} label="Thanh toán qua Ví điện tử MoMo" />
                  <FormControlLabel value="VNPAY" control={<Radio color="error" />} label="Thanh toán qua cổng VNPay" />
                </RadioGroup>
              </FormControl>
            </Paper>
          </Grid>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Tóm tắt đơn hàng</Typography>

              {/* Danh sách sản phẩm thu gọn */}
              <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
                {cart.products.map(item => (
                  <Box key={`${item.productId}-${item.sku}`} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <img src={item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: 'contain' }} />
                      <Box>
                        <Typography variant="body2" fontWeight="bold" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.color} {item.storage ? `| ${item.storage}` : ''} x{item.quantity}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">{formatPrice(item.totalPriceItem)}</Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary">Tạm tính:</Typography>
                <Typography fontWeight="bold">{formatPrice(temporaryPrice)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary">Phí vận chuyển:</Typography>
                <Typography fontWeight="bold">Miễn phí</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary">Giảm giá:</Typography>
                <Typography fontWeight="bold" color="success.main">- {formatPrice(discountAmount)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">Tổng cộng:</Typography>
                <Typography variant="h5" color="error.main" fontWeight="bold">
                  {formatPrice(finalPrice)}
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="error"
                fullWidth
                size="large"
                sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1.1rem' }}
              >
                Đặt hàng ngay
              </Button>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

export default Checkout