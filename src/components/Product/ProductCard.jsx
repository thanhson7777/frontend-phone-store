import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box, Rating } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
    }}>
      {/* 2. Bọc ảnh bằng Link. Dùng product?._id hoặc product?.slug tùy theo route fen đặt */}
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
        {/* 3. Bọc tên sản phẩm bằng Link để khách dễ bấm */}
        <Link to={`/product/${product?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            gutterBottom
            variant="subtitle1"
            sx={{
              fontWeight: 'bold',
              cursor: 'pointer',
              '&:hover': { color: 'error.main' },
              // Cắt chữ nếu tên quá dài
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
        <Button
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