import { Box, Typography, Grid } from '@mui/material'
import ProductCard from './ProductCard'
import { useState, useEffect } from 'react'
import PageLoadingSpinner from '../Loading/PageLoadingSpinner'
import { getProductsAPI } from '~/apis'

// Dữ liệu giả định để vẽ UI (Sau này khúc này sẽ được thay bằng hàm gọi API)
// const mockProducts = [
//   { _id: 'p1', name: 'iPhone 15 Pro Max 256GB Titan Tự Nhiên', price: 29500000, rating: 5, reviews: 342, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=500&q=80' },
//   { _id: 'p2', name: 'Samsung Galaxy S24 Ultra 12GB/256GB', price: 31990000, rating: 4.5, reviews: 128, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500&q=80' },
//   { _id: 'p3', name: 'Xiaomi 14 Pro 5G Leica Camera', price: 21500000, rating: 4, reviews: 56, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=500&q=80' },
//   { _id: 'p4', name: 'OPPO Find N3 Flip Hồng Cánh Sen', price: 22990000, rating: 4.5, reviews: 89, image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=500&q=80' },
//   { _id: 'p5', name: 'iPhone 14 Pro 128GB Chính hãng VN/A', price: 23500000, rating: 4.8, reviews: 512, image: 'https://images.unsplash.com/photo-1678652733289-40c26284de31?auto=format&fit=crop&w=500&q=80' },
//   { _id: 'p6', name: 'Vivo X100 Pro Đen Vũ Trụ', price: 19990000, rating: 4, reviews: 22, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=500&q=80' },
// ]

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProductsAPI()
      .then((res) => {
        // console.log('res', res)
        // console.log('res.products', res.products)
        setProducts(res.products || [])
      })
      .catch((err) => { console.log('Loi o product: ', err) })
      .finally(() => setLoading(false))
  }, [])

  // if (loading) {
  //   return <PageLoadingSpinner caption="Đang tải sản phẩm..." />
  // }

  return (
    <Box sx={{ my: 4 }}>
      {/* Tiêu đề danh sách */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '3px solid #d32f2f', display: 'inline-block', pb: 0.5 }}>
          🔥 Điện Thoại Nổi Bật
        </Typography>
        <Typography variant="body2" color="error.main" sx={{ cursor: 'pointer', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
          Xem tất cả {'>'}
        </Typography>
      </Box>

      {/* Lưới sản phẩm (Grid System) */}
      <Grid container spacing={3}>
        {products?.map((product) => (
          // xs=12 (Mobile: 1 cột), sm=6 (Tablet nhỏ: 2 cột), md=4 (Tablet lớn: 3 cột), lg=3 (PC: 4 cột)
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>

            {/* Đẩy cục data xuống cho thằng con ProductCard hiển thị */}
            <ProductCard product={product} />

          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default ProductList