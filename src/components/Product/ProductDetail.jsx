import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Container, Grid, Typography, Box, Button, Chip, Stack, Divider,
  Table, TableBody, TableCell, TableContainer, TableRow, Paper,
  Avatar, Rating, Pagination
} from '@mui/material'
import { getProductDetailAPI, getProductReviewsAPI } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { addToCartAPI } from '~/redux/carts/cartSlice'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { selectCurrentUser } from '~/redux/user/userSlice'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { IconButton } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import RateReviewIcon from '@mui/icons-material/RateReview'

function ProductDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedStorage, setSelectedStorage] = useState('')
  const [currentVariant, setCurrentVariant] = useState(null)

  // Reviews state
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [reviewsPagination, setReviewsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0
  })

  const handleAddToCart = () => {
    if (!currentUser) {
      toast.warning('Vui lòng đăng nhập để mua hàng!')
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    if (product?.variants?.length > 0 && !currentVariant) {
      toast.warning('Vui lòng chọn màu sắc và dung lượng!')
      return
    }

    const cartData = {
      productId: product._id,
      quantity: quantity,
      sku: currentVariant?.sku || null
    }

    dispatch(addToCartAPI(cartData))
      .unwrap()
      .then(() => {
        toast.success('Đã thêm sản phẩm vào giỏ hàng!')
        setQuantity(1)
      })
      .catch((error) => {
        console.log(error)
      })
  }

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

  // Fetch reviews
  useEffect(() => {
    setReviewsLoading(true)
    getProductReviewsAPI(productId, { page: reviewsPagination.currentPage, limit: 5 })
      .then(res => {
        const data = res?.data || res
        setReviews(data.reviews || [])
        if (data.pagination) {
          setReviewsPagination(prev => ({
            ...prev,
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            totalReviews: data.pagination.totalReviews
          }))
        }
      })
      .catch(err => console.log('Lỗi tải đánh giá:', err))
      .finally(() => setReviewsLoading(false))
  }, [productId, reviewsPagination.currentPage])

  const handleReviewPageChange = (event, page) => {
    setReviewsPagination(prev => ({ ...prev, currentPage: page }))
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>Thương hiệu: <strong>{product?.brand}</strong></Typography>

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

          {/* Cụm Chọn số lượng và Thêm vào giỏ hàng */}
          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 1, height: '100%' }}>
              <IconButton
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >
                <RemoveIcon />
              </IconButton>

              <Typography sx={{ px: 3, fontWeight: 'bold', fontSize: '1.2rem' }}>
                {quantity}
              </Typography>

              <IconButton
                onClick={() => setQuantity(prev => prev + 1)}
              >
                <AddIcon />
              </IconButton>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              color="error"
              disabled={!currentVariant}
              onClick={handleAddToCart}
              sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1.1rem', flexGrow: 1 }}
            >
              {currentVariant ? 'Thêm vào giỏ hàng' : 'Phiên bản không có sẵn'}
            </Button>
          </Box>
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

      {/* Phần Đánh giá sản phẩm */}
      <Box sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <RateReviewIcon color="error" fontSize="large" />
          <Typography variant="h5" fontWeight="bold" sx={{ borderLeft: '5px solid #d32f2f', pl: 2 }}>
            Đánh giá sản phẩm
          </Typography>
          {reviewsPagination.totalReviews > 0 && (
            <Chip
              label={`${reviewsPagination.totalReviews} đánh giá`}
              color="error"
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Box>

        {reviewsLoading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">Đang tải đánh giá...</Typography>
          </Box>
        ) : reviews.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#f8f9fa', borderRadius: 2 }}>
            <Typography color="text.secondary">
              Chưa có đánh giá nào cho sản phẩm này.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Hãy là người đầu tiên đánh giá sản phẩm!
            </Typography>
          </Box>
        ) : (
          <>
            <Stack spacing={3}>
              {reviews.map((review) => (
                <Paper key={review._id} elevation={0} sx={{ p: 3, border: '1px solid #eee', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'error.main' }}>
                      {review.userInfo?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold">
                        {review.userInfo?.displayName || review.userInfo?.username || 'Người dùng'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating
                          value={review.rating}
                          readOnly
                          size="small"
                          icon={<StarIcon fontSize="inherit" sx={{ color: '#ffc107' }} />}
                          emptyIcon={<StarIcon fontSize="inherit" sx={{ color: '#e0e0e0' }} />}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(review.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ pl: 7 }}>
                    {review.content}
                  </Typography>
                  {review.image && (
                    <Box sx={{ mt: 2, pl: 7 }}>
                      <Box
                        component="img"
                        src={review.image}
                        alt="Review image"
                        sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1, cursor: 'pointer' }}
                        onClick={() => window.open(review.image, '_blank')}
                      />
                    </Box>
                  )}
                </Paper>
              ))}
            </Stack>

            {/* Phân trang đánh giá */}
            {reviewsPagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={reviewsPagination.totalPages}
                  page={reviewsPagination.currentPage}
                  onChange={handleReviewPageChange}
                  color="error"
                  size="small"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  )
}

export default ProductDetail
