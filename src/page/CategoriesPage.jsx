import { useState, useEffect } from 'react'
import {
  Box, Container, Typography, Grid, Card, CardContent,
  Breadcrumbs, Link, Chip, Skeleton, Button
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { getCategoryAPI, getProductsAPI } from '~/apis'
import { Link as RouterLink } from 'react-router-dom'
import ProductCard from '~/components/Product/ProductCard'

// Gradient colors for categories
const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
]

function CategoryCard({ category, index, onHover }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch products when hovering
  useEffect(() => {
    if (onHover) {
      setLoading(true)
      getProductsAPI({ category: category._id, itemsPerPage: 4 })
        .then((res) => {
          setProducts(res.products || [])
        })
        .catch((err) => console.log('Lỗi tải sản phẩm:', err))
        .finally(() => setLoading(false))
    }
  }, [onHover, category._id])

  return (
    <Card
      sx={{
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
        }
      }}
    >
      {/* Category Header */}
      <Box
        sx={{
          background: gradients[index % gradients.length],
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Icon */}
        <Typography
          sx={{
            fontSize: '5rem',
            opacity: 0.3,
            color: 'white',
            position: 'absolute',
            right: -20,
            bottom: -20
          }}
        >
          📱
        </Typography>

        {/* Category Info */}
        <Box sx={{ textAlign: 'center', color: 'white', zIndex: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {category.name}
          </Typography>
          {category.productCount && (
            <Chip
              label={`${category.productCount} sản phẩm`}
              size="small"
              sx={{
                mt: 1,
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
            />
          )}
        </Box>
      </Box>

      {/* Preview Products */}
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
          Sản phẩm nổi bật
        </Typography>

        {loading ? (
          <Grid container spacing={1}>
            {[...Array(4)].map((_, i) => (
              <Grid item xs={6} key={i}>
                <Skeleton variant="rectangular" height={80} />
              </Grid>
            ))}
          </Grid>
        ) : products.length > 0 ? (
          <Grid container spacing={1}>
            {products.slice(0, 4).map((product) => (
              <Grid item xs={6} key={product._id}>
                <Box
                  component={RouterLink}
                  to={`/product/${product._id}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 0.5,
                    borderRadius: 1,
                    textDecoration: 'none',
                    '&:hover': {
                      bgcolor: '#f5f5f5'
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={product.image}
                    alt={product.name}
                    sx={{
                      width: 50,
                      height: 50,
                      objectFit: 'contain',
                      borderRadius: 1
                    }}
                  />
                  <Box sx={{ overflow: 'hidden', flex: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        color: 'text.primary',
                        fontWeight: 500
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="error.main"
                      fontWeight="bold"
                    >
                      {new Intl.NumberFormat('vi-VN').format(product.basePrice)}đ
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Chưa có sản phẩm
          </Typography>
        )}

        {/* View All Button */}
        <Button
          component={RouterLink}
          to={`/category/${category._id}`}
          fullWidth
          variant="outlined"
          color="error"
          endIcon={<ArrowForwardIcon />}
          sx={{ mt: 2 }}
        >
          Xem tất cả
        </Button>
      </CardContent>
    </Card>
  )
}

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategoryAPI()
      .then((res) => {
        const categoriesData = res?.categories || res || []
        setCategories(categoriesData)
      })
      .catch((err) => console.log('Lỗi tải danh mục:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link component="a" href="/" color="inherit" underline="hover">
            Trang chủ
          </Link>
          <Typography color="text.primary">Danh mục</Typography>
        </Breadcrumbs>

        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ mb: 1, borderBottom: '4px solid #d32f2f', display: 'inline-block', pb: 1 }}
          >
            Danh Mục Sản Phẩm
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Khám phá các danh mục điện thoại thông minh chính hãng
          </Typography>
        </Box>

        {/* Categories Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        ) : categories.length > 0 ? (
          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={category._id}>
                <CategoryCard category={category} index={index} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Chưa có danh mục nào
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default CategoriesPage
