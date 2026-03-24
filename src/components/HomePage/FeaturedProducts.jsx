import { useState, useEffect } from 'react'
import { Box, Container, Typography, Grid, Button } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ProductCard from '../Product/ProductCard'
import { getProductsAPI } from '~/apis'

function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getProductsAPI({ itemsPerPage: 8, sortBy: 'sold_desc' })
      .then((res) => {
        setProducts(res.products?.slice(0, 8) || [])
      })
      .catch((err) => console.log('Lỗi tải sản phẩm nổi bật:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Box sx={{ mb: 5 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarIcon sx={{ color: '#ffc107', fontSize: 32 }} />
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ borderLeft: '5px solid #d32f2f', pl: 2 }}
            >
              Sản Phẩm Nổi Bật
            </Typography>
          </Box>
          <Button
            variant="text"
            endIcon={<NavigateNextIcon />}
            sx={{
              color: 'error.main',
              fontWeight: 'bold',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Xem tất cả
          </Button>
        </Box>

        {/* Products Grid */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography>Đang tải sản phẩm...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={6} sm={4} md={3} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}

export default FeaturedProducts
