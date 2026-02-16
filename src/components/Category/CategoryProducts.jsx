import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Grid, Typography, Box } from '@mui/material'
import { getCategoryDetailsAPI } from '~/apis'
import ProductCard from '~/components/Product/ProductCard'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

function CategoryProducts() {
  const { categoryId } = useParams()
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getCategoryDetailsAPI(categoryId)
      .then(res => {
        // Log ra để xem cấu trúc data (là mảng sản phẩm hay object category chứa mảng)
        console.log('Category Details:', res)
        setCategory(res)
      })
      .catch(err => console.error('Lỗi lấy sp theo danh mục:', err))
      .finally(() => setLoading(false))
  }, [categoryId])

  if (loading) return <PageLoadingSpinner caption="Đang lọc sản phẩm..." />

  // Giả sử backend trả về object: { _id, name, products: [...] }
  const products = category?.products || []

  return (
    <Container sx={{ my: 4 }}>
      {/* Hiện tên danh mục cho khách biết đang ở đâu */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, textTransform: 'uppercase' }}>
        Danh mục: {category?.name || 'Đang tải...'}
      </Typography>

      {products.length > 0 ? (
        <Grid container spacing={3}>
          {products.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      ) : (
        /* Trường hợp không có sản phẩm nào */
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">
            Danh mục này hiện chưa có sản phẩm nào, fen quay lại sau nhé! 😅
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default CategoryProducts