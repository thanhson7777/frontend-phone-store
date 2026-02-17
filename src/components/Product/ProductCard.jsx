import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { selectCurrentUser } from '~/redux/user/userSlice'
import { addToCartAPI } from '~/redux/carts/cartSlice'

function ProductCard({ product }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = useSelector(selectCurrentUser)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const handleAddToCartClick = () => {
    if (!currentUser) {
      toast.warning('Fen vui lòng đăng nhập để mua hàng nhé!')
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    if (product?.variants?.length > 0) {
      toast.info('Vui lòng chọn màu sắc/dung lượng trước khi thêm vào giỏ!')
      // Dùng _id hoặc slug tùy vào cấu hình Route
      navigate(`/product/${product?._id}`)
      return
    }

    const cartData = {
      productId: product._id,
      quantity: 1,
      sku: null
    }

    dispatch(addToCartAPI(cartData))
      .unwrap()
      .then(() => {
        toast.success(`Đã thêm vào giỏ hàng!`)
      })
      .catch((error) => {
        console.log('Lỗi thêm giỏ hàng:', error)
      })
  }

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
    }}>
      {/* Bọc ảnh bằng Link */}
      <Link to={`/product/${product?._id}`} style={{ textDecoration: 'none' }}>
        <CardMedia
          component="img"
          height="200"
          image={product?.image || 'https://via.placeholder.com/200'}
          alt={product?.name}
          sx={{ objectFit: 'contain', p: 2, cursor: 'pointer' }}
        />
      </Link>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Bọc tên sản phẩm bằng Link */}
        <Link to={`/product/${product?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            gutterBottom
            variant="subtitle1"
            sx={{
              fontWeight: 'bold',
              cursor: 'pointer',
              '&:hover': { color: 'error.main' },
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product?.name}
          </Typography>
        </Link>

        <Typography variant="h6" color="error.main" sx={{ fontWeight: 'bold', mt: 1 }}>
          {formatPrice(product?.basePrice || 0)}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        {/* Gắn sự kiện onClick vào đây */}
        <Button
          onClick={handleAddToCartClick}
          variant="contained"
          color="error"
          fullWidth
          startIcon={<ShoppingCartIcon />}
          sx={{ textTransform: 'none', fontWeight: 'bold' }}
        >
          Thêm vào giỏ
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProductCard