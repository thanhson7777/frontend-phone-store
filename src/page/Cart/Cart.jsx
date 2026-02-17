import { useEffect } from 'react'
import { Box, Typography, Grid, Card, CardContent, IconButton, Button, Divider, Avatar } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectCurrentCarts, fetchCartsAPI, updateCartsAPI } from '~/redux/carts/cartSlice'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

function Cart() {
  const dispatch = useDispatch()
  const cart = useSelector(selectCurrentCarts)

  useEffect(() => {
    dispatch(fetchCartsAPI())
  }, [dispatch])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
  }

  const handleUpdateQuantity = (productId, sku, newQuantity) => {
    dispatch(updateCartsAPI({ productId, sku, quantity: newQuantity }))
      .unwrap() // Dùng unwrap để bắt kết quả trả về từ createAsyncThunk
      .then(() => {
        // Có thể không cần báo thành công vì nó cập nhật rất nhanh
        // toast.success('Cập nhật số lượng thành công!') 
      })
      .catch((error) => {
        // Lỗi này có thể là do vượt quá số lượng tồn kho (Backend trả về 400)
        // Toastify ở authorizeAxiosInstance đã tự động hiện lỗi rồi nên không cần code thêm gì nhiều
        console.log('Lỗi cập nhật:', error)
      })
  }

  const handleRemoveItem = (productId, sku) => {
    if (window.confirm('Fen có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?')) {

      // Truyền quantity = 0 để Backend tự hiểu là Xóa sản phẩm
      dispatch(updateCartsAPI({ productId, sku, quantity: 0 }))
        .unwrap()
        .then(() => {
          toast.success('Đã xóa sản phẩm khỏi giỏ hàng!')
        })
        .catch((error) => {
          console.log('Lỗi xóa sản phẩm:', error)
        })
    }
  }

  if (!cart) return <PageLoadingSpinner caption="Đang tải giỏ hàng..." />

  const products = cart?.products || []

  if (products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10, mb: 10 }}>
        <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" width="150" />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2, mb: 3 }}>
          Giỏ hàng của fen đang trống trơn!
        </Typography>
        <Button component={Link} to="/" variant="contained" color="error">
          Đi mua sắm ngay
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, textTransform: 'uppercase' }}>
        🛒 Giỏ hàng của bạn
      </Typography>

      <Grid container spacing={4}>
        {/* BÊN TRÁI: DANH SÁCH SẢN PHẨM */}
        <Grid item xs={12} md={8}>
          {products.map((item) => (
            <Card key={`${item.productId}-${item.sku || 'default'}`} sx={{ display: 'flex', mb: 2, p: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              {/* Ảnh sản phẩm */}
              <Avatar
                variant="rounded"
                src={item.image}
                sx={{ width: 100, height: 100, bgcolor: 'transparent', objectFit: 'contain' }}
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: 2, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography component={Link} to={`/product/${item.productId}`} variant="h6" sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit', '&:hover': { color: 'error.main' } }}>
                      {item.name}
                    </Typography>

                    {(item.color || item.storage) && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Phân loại: {item.color} {item.color && item.storage && '|'} {item.storage}
                      </Typography>
                    )}
                  </Box>

                  <IconButton color="error" onClick={() => handleRemoveItem(item.productId, item.sku)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    {/* Các hàm onClick ở đây đã khớp với tham số mới sửa ở trên */}
                    <IconButton size="small" onClick={() => handleUpdateQuantity(item.productId, item.sku, item.quantity - 1)}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ px: 2, fontWeight: 'bold' }}>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => handleUpdateQuantity(item.productId, item.sku, item.quantity + 1)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography variant="h6" color="error.main" fontWeight="bold">
                    {formatPrice(item.totalPriceItem)}
                  </Typography>
                </Box>
              </Box>
            </Card>
          ))}
        </Grid>

        {/* BÊN PHẢI: TÓM TẮT ĐƠN HÀNG */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Tóm tắt đơn hàng
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">Tạm tính:</Typography>
              <Typography fontWeight="bold">{formatPrice(cart.totalPrice)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">Giảm giá:</Typography>
              <Typography fontWeight="bold">{formatPrice(cart.discountAmount || 0)}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">Tổng cộng:</Typography>
              <Typography variant="h5" color="error.main" fontWeight="bold">
                {formatPrice(cart.finalPrice > 0 ? cart.finalPrice : cart.totalPrice)}
              </Typography>
            </Box>

            <Button variant="contained" color="error" fullWidth size="large" sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1.1rem' }}>
              Tiến hành Thanh toán
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box >
  )
}

export default Cart