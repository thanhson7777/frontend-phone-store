import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Grid, Typography, Box, Button, Chip, Stack, Divider, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material'
import { getProductDetailAPI } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { useDispatch } from 'react-redux'
import { addCurrentCart } from '~/redux/carts/cartSlice'
import { toast } from 'react-toastify'

function ProductDetail() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedStorage, setSelectedStorage] = useState('')
  const [currentVariant, setCurrentVariant] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    setLoading(true)
    getProductDetailAPI(productId)
      .then(res => {
        const data = res?.data || res
        setProduct(data)

        if (data?.variants?.length > 0) {
          setSelectedColor(data.variants[0].color)
          setSelectedStorage(data.variants[0].storage)
          setCurrentVariant(data.variants[0])
        }
      })
      .catch(err => toast.error('Không lấy được thông tin sản phẩm'))
      .finally(() => setLoading(false))
  }, [productId])

  useEffect(() => {
    if (product?.variants) {
      const variant = product.variants.find(v => v.color === selectedColor && v.storage === selectedStorage)
      setCurrentVariant(variant || null)
    }
  }, [selectedColor, selectedStorage, product])

  if (loading) return <PageLoadingSpinner caption="Đang tải sản phẩm..." />
  if (!product) return <Typography sx={{ mt: 10, textAlign: 'center' }}>Không tìm thấy sản phẩm!</Typography>

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box component="img"
            src={currentVariant?.image || product?.image}
            sx={{ width: '100%', borderRadius: 2, border: '1px solid #eee', objectFit: 'contain', maxHeight: 500 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold">{product?.name}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>Thương hiệu: **{product?.brand}**</Typography>

          <Box sx={{ my: 2, p: 2, bgcolor: '#fff5f5', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h4" color="error" fontWeight="bold">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentVariant?.price || product?.basePrice)}
            </Typography>
            {product?.sold > 0 && <Typography variant="body2" color="text.secondary">Đã bán: {product?.sold}</Typography>}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Biến thể: Màu sắc */}
          <Typography fontWeight="bold" sx={{ mb: 1 }}>Màu sắc:</Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            {[...new Set(product?.variants?.map(v => v.color))].map(color => (
              <Chip
                key={color}
                label={color}
                clickable
                color={selectedColor === color ? "error" : "default"}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </Stack>

          {/* Biến thể: Dung lượng */}
          <Typography fontWeight="bold" sx={{ mb: 1 }}>Bộ nhớ:</Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            {[...new Set(product?.variants?.map(v => v.storage))].map(storage => (
              <Chip
                key={storage}
                label={storage}
                clickable
                color={selectedStorage === storage ? "error" : "default"}
                onClick={() => setSelectedStorage(storage)}
              />
            ))}
          </Stack>

          {/* Nút bấm */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            color="error"
            disabled={!currentVariant}
            onClick={() => {
              dispatch(addCurrentCart({ ...product, selectedVariant: currentVariant }))
              toast.success('Đã thêm vào giỏ hàng!')
            }}
            sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            {currentVariant ? 'Thêm vào giỏ hàng' : 'Phiên bản này không có sẵn'}
          </Button>
        </Grid>
      </Grid>

      {/* Thông số kỹ thuật */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ borderLeft: '5px solid #d32f2f', pl: 2 }}>Thông số kỹ thuật</Typography>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', mt: 2 }}>
          <Table>
            <TableBody>
              {Object.entries(product?.specs || {}).map(([key, value]) => (
                <TableRow key={key} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                  <TableCell sx={{ fontWeight: 'bold', width: '30%', textTransform: 'capitalize' }}>{key}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  )
}

export default ProductDetail