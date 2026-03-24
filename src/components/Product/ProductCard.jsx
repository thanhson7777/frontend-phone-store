import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box, Tooltip } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { selectCurrentUser } from '~/redux/user/userSlice'
import { addToCartAPI } from '~/redux/carts/cartSlice'

import { getProductColorSwatches } from '~/utils/productColorUtils'

function ProductCard({ product }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = useSelector(selectCurrentUser)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  // Get price range từ variants
  const getPriceRange = () => {
    if (!product?.variants?.length) return null
    const prices = product.variants.map(v => v.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    if (min === max) return formatPrice(min)
    return `${formatPrice(min)} - ${formatPrice(max)}`
  }

  const handleAddToCartClick = () => {
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để mua hàng nhé!')
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    if (product?.variants?.length > 0) {
      toast.info('Vui lòng chọn màu sắc/dung lượng trước khi thêm vào giỏ!')
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

  const colors = getProductColorSwatches(product)
  const priceRange = getPriceRange()

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
    }}>
      {/* Bọc ảnh bằng Link */}
      <Link to={`/product/${product?._id}`} style={{ textDecoration: 'none', position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product?.image || 'https://via.placeholder.com/200'}
          alt={product?.name}
          sx={{ objectFit: 'contain', p: 2, cursor: 'pointer' }}
        />
        {/* Badge số lượng biến thể */}
        {colors.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'rgba(0,0,0,0.6)',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.7rem',
              fontWeight: 'bold'
            }}
          >
            {colors.length} màu
          </Box>
        )}
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
              overflow: 'hidden',
              minHeight: 44
            }}
          >
            {product?.name}
          </Typography>
        </Link>

        {/* Color swatches */}
        {colors.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1, mb: 1 }}>
            {colors.slice(0, 5).map((color) => (
              <Tooltip key={color.name} title={color.name} arrow placement="top">
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: color.hex,
                    border: '2px solid white',
                    boxShadow: '0 0 0 1px #e0e0e0',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.2)' }
                  }}
                />
              </Tooltip>
            ))}
            {colors.length > 5 && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                +{colors.length - 5}
              </Typography>
            )}
          </Box>
        )}

        {/* Giá */}
        <Typography variant="h6" color="error.main" sx={{ fontWeight: 'bold' }}>
          {priceRange || formatPrice(product?.basePrice || 0)}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
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
