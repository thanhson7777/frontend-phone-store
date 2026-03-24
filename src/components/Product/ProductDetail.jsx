import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Container, Grid, Typography, Box, Button, Chip, Stack, Divider,
  Table, TableBody, TableCell, TableContainer, TableRow, Paper,
  Avatar, Rating, Pagination, Tooltip
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
import CheckIcon from '@mui/icons-material/Check'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

// Color mapping cho điện thoại
const colorHexMap = {
  'đen': '#1a1a1a',
  'black': '#1a1a1a',
  'trắng': '#F5F5F5',
  'white': '#F5F5F5',
  'xanh dương': '#2196F3',
  'blue': '#2196F3',
  'đỏ': '#E53935',
  'red': '#E53935',
  'vàng': '#FFD700',
  'gold': '#FFD700',
  'xanh lá': '#43A047',
  'green': '#43A047',
  'tím': '#9C27B0',
  'purple': '#9C27B0',
  'hồng': '#E91E63',
  'pink': '#E91E63',
  'xám': '#757575',
  'gray': '#757575',
  'bạc': '#C0C0C0',
  'silver': '#C0C0C0',
  'titan': '#8B8970'
}

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

  const normalizeText = (v) => (typeof v === 'string' ? v.trim() : '')

  const extractVariantColor = (variant) => {
    if (!variant || typeof variant !== 'object') return ''
    return (
      normalizeText(variant.color) ||
      normalizeText(variant.mauSac) ||
      normalizeText(variant.colour) ||
      normalizeText(variant.colorName) ||
      normalizeText(variant.tenMau) ||
      normalizeText(variant?.attributes?.color) ||
      normalizeText(variant?.attributes?.mauSac) ||
      normalizeText(variant?.optionValues?.color)
    )
  }

  const extractVariantStorage = (variant) => {
    if (!variant || typeof variant !== 'object') return ''
    return (
      normalizeText(variant.storage) ||
      normalizeText(variant.dungLuong) ||
      normalizeText(variant.boNho) ||
      normalizeText(variant.rom) ||
      normalizeText(variant.capacity) ||
      normalizeText(variant?.attributes?.storage) ||
      normalizeText(variant?.attributes?.dungLuong) ||
      normalizeText(variant?.optionValues?.storage)
    )
  }

  const extractVariantQuantity = (variant) => {
    const candidates = [variant?.quantity, variant?.stock, variant?.soLuong, variant?.inventory]
    const n = candidates.find(v => typeof v === 'number' && Number.isFinite(v))
    return typeof n === 'number' ? n : 0
  }

  const extractVariantPrice = (variant, fallbackBasePrice) => {
    const candidates = [variant?.price, variant?.gia, variant?.variantPrice, variant?.salePrice]
    const n = candidates.find(v => typeof v === 'number' && Number.isFinite(v))
    return typeof n === 'number' ? n : (typeof fallbackBasePrice === 'number' ? fallbackBasePrice : 0)
  }

  const extractVariantSku = (variant) => {
    return normalizeText(variant?.sku) || normalizeText(variant?.SKU) || normalizeText(variant?.code) || null
  }

  const extractVariantImage = (variant, fallbackImage) => {
    return (
      normalizeText(variant?.image) ||
      normalizeText(variant?.thumbnail) ||
      normalizeText(variant?.img) ||
      normalizeText(variant?.images?.[0]) ||
      normalizeText(variant?.attributes?.image) ||
      normalizeText(fallbackImage)
    ) || null
  }

  const normalizeVariants = (rawVariants, fallbackImage, fallbackBasePrice) => {
    if (!Array.isArray(rawVariants)) return []
    return rawVariants
      .map((v) => {
        const color = extractVariantColor(v)
        const storage = extractVariantStorage(v)
        return {
          ...v,
          color,
          storage,
          quantity: extractVariantQuantity(v),
          price: extractVariantPrice(v, fallbackBasePrice),
          sku: extractVariantSku(v),
          image: extractVariantImage(v, fallbackImage)
        }
      })
      .filter(v => v.color || v.storage || v.sku)
  }

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
        const normalized = {
          ...data,
          variants: normalizeVariants(data?.variants, data?.image, data?.basePrice)
        }
        setProduct(normalized)

        if (normalized?.variants?.length > 0) {
          // Tìm variant đầu tiên có sẵn
          const availableVariant = normalized.variants.find(v => v.quantity > 0) || normalized.variants[0]
          setSelectedColor(availableVariant.color)
          setSelectedStorage(availableVariant.storage)
          setCurrentVariant(availableVariant)
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

  // Helper: Format price với chênh lệch
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  // Helper: Tính chênh lệch giá so với base price
  const getPriceDiff = (variantPrice) => {
    if (!currentVariant || variantPrice === currentVariant.price) return null
    const diff = variantPrice - currentVariant.price
    if (diff > 0) return `+${formatPrice(diff)}đ`
    if (diff < 0) return `${formatPrice(diff)}đ`
    return null
  }

  // Helper: Get unique colors từ variants
  const getUniqueColors = () => {
    if (!product?.variants) return []
    const colorMap = new Map()
    product.variants.forEach(v => {
      if (!colorMap.has(v.color)) {
        // Kiểm tra xem color có variant nào còn hàng không
        const hasStock = product.variants.some(
          variant => variant.color === v.color && variant.quantity > 0
        )
        colorMap.set(v.color, {
          name: v.color,
          hasStock,
          image: v.image || product.image
        })
      }
    })
    return Array.from(colorMap.values())
  }

  // Helper: Get unique storages từ variants
  const getUniqueStorages = () => {
    if (!product?.variants) return []
    const storageMap = new Map()
    product.variants.forEach(v => {
      if (!storageMap.has(v.storage)) {
        // Kiểm tra xem storage có variant nào còn hàng không
        const hasStock = product.variants.some(
          variant => variant.storage === v.storage && variant.quantity > 0
        )
        storageMap.set(v.storage, {
          name: v.storage,
          price: v.price,
          hasStock
        })
      }
    })
    return Array.from(storageMap.values())
  }

  // Helper: Check nếu tổ hợp color + storage có sẵn
  const isCombinationAvailable = (color, storage) => {
    if (!product?.variants) return false
    const variant = product.variants.find(v => v.color === color && v.storage === storage)
    return variant && variant.quantity > 0
  }

  // Get color hex
  const getColorHex = (colorName) => {
    const raw = normalizeText(colorName)
    if (!raw) return '#757575'

    // Cho phép admin nhập thẳng mã màu, ví dụ: #ff0000
    const directHex = raw.match(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/)
    if (directHex) return raw

    // Normalize: lowercase + remove diacritics + collapse spaces
    const normalized = raw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    // Match exact keys (cả tiếng Việt có dấu lẫn không dấu)
    const byExact =
      colorHexMap[normalized] ||
      colorHexMap[normalized.replace(/đ/g, 'd')] ||
      colorHexMap[raw.toLowerCase().trim()]
    if (byExact) return byExact

    // Match theo từ khoá (trường hợp admin nhập: "đen nhám", "xanh dương pastel", ...)
    const keywordRules = [
      { keys: ['den', 'black'], hex: '#1a1a1a' },
      { keys: ['trang', 'white'], hex: '#F5F5F5' },
      { keys: ['xanh duong', 'blue'], hex: '#2196F3' },
      { keys: ['do', 'red'], hex: '#E53935' },
      { keys: ['vang', 'gold', 'yellow'], hex: '#FFD700' },
      { keys: ['xanh la', 'green'], hex: '#43A047' },
      { keys: ['tim', 'purple'], hex: '#9C27B0' },
      { keys: ['hong', 'pink'], hex: '#E91E63' },
      { keys: ['xam', 'gray', 'grey'], hex: '#757575' },
      { keys: ['bac', 'silver'], hex: '#C0C0C0' },
      { keys: ['titan'], hex: '#8B8970' }
    ]
    const matched = keywordRules.find(r => r.keys.some(k => normalized.includes(k)))
    if (matched) return matched.hex

    // Fallback: tạo màu ổn định theo tên (để không bị "xám" hết)
    let hash = 0
    for (let i = 0; i < normalized.length; i++) {
      hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0
    }
    const r = 80 + (hash & 0x7f)
    const g = 80 + ((hash >> 8) & 0x7f)
    const b = 80 + ((hash >> 16) & 0x7f)
    return `rgb(${r}, ${g}, ${b})`
  }

  if (loading) return <PageLoadingSpinner caption="Đang tải sản phẩm..." />
  if (!product) return <Typography sx={{ mt: 10, textAlign: 'center' }}>Không tìm thấy sản phẩm!</Typography>

  const colors = getUniqueColors()
  const storages = getUniqueStorages()
  const basePrice = currentVariant?.price || product?.basePrice

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Grid container spacing={4}>
        {/* Hình ảnh sản phẩm */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={currentVariant?.image || product?.image}
              sx={{
                width: '100%',
                borderRadius: 3,
                border: '1px solid #eee',
                objectFit: 'contain',
                maxHeight: 500,
                bgcolor: '#fafafa',
                transition: 'all 0.3s ease'
              }}
            />
            {/* Badge hết hàng */}
            {!currentVariant && product?.variants?.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}
              >
                Hết hàng
              </Box>
            )}
          </Box>
        </Grid>

        {/* Thông tin sản phẩm */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            {product?.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="body1" color="text.secondary">
              Thương hiệu:
            </Typography>
            <Chip
              label={product?.brand}
              size="small"
              sx={{
                bgcolor: 'rgba(211, 47, 47, 0.1)',
                color: 'error.main',
                fontWeight: 'bold'
              }}
            />
            {product?.sold > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                | Đã bán: <strong>{product?.sold}</strong>
              </Typography>
            )}
          </Box>

          {/* Giá */}
          <Box sx={{
            my: 3,
            p: 3,
            bgcolor: currentVariant ? '#fff5f5' : '#f5f5f5',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '2px solid',
            borderColor: currentVariant ? 'error.light' : 'grey.300'
          }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Giá {currentVariant ? `(${selectedColor}, ${selectedStorage})` : ''}
              </Typography>
              <Typography variant="h3" color="error.main" fontWeight="bold">
                {currentVariant ? formatPrice(basePrice) : 'Liên hệ'}
                <Typography component="span" variant="h5" color="error.main">đ</Typography>
              </Typography>
            </Box>
            {!currentVariant && product?.variants?.length > 0 && (
              <Tooltip title="Tổ hợp màu/dung lượng này hiện không có sẵn">
                <ErrorOutlineIcon sx={{ fontSize: 32, color: 'warning.main' }} />
              </Tooltip>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Biến thể: Màu sắc */}
          {colors.length > 0 && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography fontWeight="bold" sx={{ fontSize: '1rem' }}>
                  Màu sắc:
                </Typography>
                {selectedColor && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedColor}
                  </Typography>
                )}
              </Box>
              <Stack direction="row" spacing={1.5} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                {colors.map((color) => {
                  const isSelected = selectedColor === color.name
                  const isDisabled = !color.hasStock

                  return (
                    <Tooltip
                      key={color.name}
                      title={isDisabled ? 'Tạm hết hàng' : color.name}
                      arrow
                    >
                      <Box
                        onClick={() => !isDisabled && setSelectedColor(color.name)}
                        sx={{
                          position: 'relative',
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          bgcolor: getColorHex(color.name),
                          border: isSelected ? '3px solid #d32f2f' : '2px solid #e0e0e0',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          opacity: isDisabled ? 0.4 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 4px 12px rgba(211,47,47,0.4)' : 'none',
                          '&:hover': !isDisabled ? {
                            transform: 'scale(1.1)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                          } : {}
                        }}
                      >
                        {isSelected && (
                          <CheckIcon
                            sx={{
                              fontSize: 20,
                              color: ['trắng', 'white', 'vàng', 'gold', 'bạc', 'silver'].includes(color.name?.toLowerCase())
                                ? 'black'
                                : 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        )}
                        {isDisabled && (
                          <Box
                            sx={{
                              position: 'absolute',
                              width: '100%',
                              height: 2,
                              bgcolor: 'error.main',
                              transform: 'rotate(-45deg)',
                              borderRadius: 1
                            }}
                          />
                        )}
                      </Box>
                    </Tooltip>
                  )
                })}
              </Stack>
            </>
          )}

          {/* Biến thể: Dung lượng */}
          {storages.length > 0 && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography fontWeight="bold" sx={{ fontSize: '1rem' }}>
                  Dung lượng:
                </Typography>
                {selectedStorage && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedStorage}
                  </Typography>
                )}
              </Box>
              <Stack direction="row" spacing={1.5} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                {storages.map((storage) => {
                  const isSelected = selectedStorage === storage.name
                  const isDisabled = !storage.hasStock
                  const isCurrentVariant = currentVariant?.storage === storage.name
                  const priceDiff = isCurrentVariant ? null : getPriceDiff(storage.price)

                  return (
                    <Tooltip
                      key={storage.name}
                      title={isDisabled ? 'Tạm hết hàng' : ''}
                      arrow
                    >
                      <Box
                        onClick={() => !isDisabled && setSelectedStorage(storage.name)}
                        sx={{
                          position: 'relative',
                          px: 2.5,
                          py: 1.5,
                          minWidth: 100,
                          borderRadius: 2,
                          bgcolor: isSelected ? 'error.main' : isDisabled ? '#f5f5f5' : 'white',
                          color: isSelected ? 'white' : isDisabled ? 'text.disabled' : 'text.primary',
                          border: isSelected ? '2px solid #d32f2f' : '2px solid #e0e0e0',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          opacity: isDisabled ? 0.5 : 1,
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: isSelected ? '0 4px 12px rgba(211,47,47,0.3)' : 'none',
                          '&:hover': !isDisabled ? {
                            borderColor: 'error.main',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          } : {}
                        }}
                      >
                        {isSelected && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              width: 22,
                              height: 22,
                              bgcolor: 'white',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                          >
                            <CheckIcon sx={{ fontSize: 14, color: 'error.main' }} />
                          </Box>
                        )}
                        <Typography
                          sx={{
                            fontWeight: isSelected ? 'bold' : 'medium',
                            fontSize: '0.95rem'
                          }}
                        >
                          {storage.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.75rem',
                            opacity: 0.9,
                            color: isSelected ? 'white' : 'text.secondary'
                          }}
                        >
                          {priceDiff || formatPrice(storage.price) + 'đ'}
                        </Typography>
                        {isDisabled && (
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: '0.65rem',
                              color: 'error.main',
                              fontWeight: 'bold'
                            }}
                          >
                            Hết hàng
                          </Typography>
                        )}
                      </Box>
                    </Tooltip>
                  )
                })}
              </Stack>
            </>
          )}

          {/* Thông báo tổ hợp không hợp lệ */}
          {selectedColor && selectedStorage && !currentVariant && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                bgcolor: 'warning.light',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <ErrorOutlineIcon color="warning" />
              <Typography variant="body2" color="warning.dark">
                Tổ hợp <strong>{selectedColor}</strong> và <strong>{selectedStorage}</strong> hiện không có sẵn. Vui lòng chọn tổ hợp khác.
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Cụm Chọn số lượng và Thêm vào giỏ hàng */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            {/* Quantity selector */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '2px solid #e0e0e0',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <IconButton
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                sx={{
                  borderRadius: 0,
                  px: 1.5,
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                <RemoveIcon />
              </IconButton>

              <Typography
                sx={{
                  px: 3,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  minWidth: 50,
                  textAlign: 'center'
                }}
              >
                {quantity}
              </Typography>

              <IconButton
                onClick={() => setQuantity(prev => prev + 1)}
                disabled={!currentVariant || (currentVariant?.quantity && quantity >= currentVariant.quantity)}
                sx={{
                  borderRadius: 0,
                  px: 1.5,
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>

            {/* Stock info */}
            {currentVariant && (
              <Typography variant="body2" color="text.secondary">
                {currentVariant.quantity > 0
                  ? `Còn ${currentVariant.quantity} sản phẩm`
                  : 'Hết hàng'
                }
              </Typography>
            )}

            {/* Add to cart button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              color="error"
              disabled={!currentVariant}
              onClick={handleAddToCart}
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1rem',
                borderRadius: 2,
                boxShadow: currentVariant ? '0 4px 12px rgba(211,47,47,0.3)' : 'none',
                '&:hover': {
                  boxShadow: currentVariant ? '0 6px 16px rgba(211,47,47,0.4)' : 'none'
                }
              }}
            >
              {currentVariant ? '🛒 Thêm vào giỏ hàng' : 'Phiên bản không có sẵn'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Thông số kỹ thuật */}
      {product?.specs && Object.keys(product.specs).length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Thông số kỹ thuật
            </Typography>
          </Box>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: '1px solid #eee',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Table>
              <TableBody>
                {Object.entries(product.specs).map(([key, value], index) => (
                  <TableRow
                    key={key}
                    sx={{
                      bgcolor: index % 2 === 0 ? '#fafafa' : 'white',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        width: '30%',
                        textTransform: 'capitalize',
                        borderRight: '1px solid #eee',
                        color: 'text.secondary'
                      }}
                    >
                      {key === 'screen' ? 'Màn hình' :
                       key === 'cpu' ? 'Chip xử lý (CPU)' :
                       key === 'ram' ? 'RAM' :
                       key === 'camera' ? 'Camera' :
                       key === 'battery' ? 'Pin' : key}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      {value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Phần Đánh giá sản phẩm */}
      <Box sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <RateReviewIcon color="error" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">
            Đánh giá sản phẩm
          </Typography>
          {reviewsPagination.totalReviews > 0 && (
            <Chip
              label={`${reviewsPagination.totalReviews} đánh giá`}
              color="error"
              size="small"
            />
          )}
        </Box>

        {reviewsLoading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">Đang tải đánh giá...</Typography>
          </Box>
        ) : reviews.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6, bgcolor: '#f8f9fa', borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Chưa có đánh giá nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hãy là người đầu tiên đánh giá sản phẩm này!
            </Typography>
          </Box>
        ) : (
          <>
            <Stack spacing={3}>
              {reviews.map((review) => (
                <Paper
                  key={review._id}
                  elevation={0}
                  sx={{
                    p: 3,
                    border: '1px solid #eee',
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'error.main',
                        width: 48,
                        height: 48
                      }}
                    >
                      {review.userInfo?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                        <Typography fontWeight="bold" variant="subtitle1">
                          {review.userInfo?.displayName || review.userInfo?.username || 'Người dùng'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(review.createdAt)}
                        </Typography>
                      </Box>
                      <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        icon={<StarIcon fontSize="inherit" sx={{ color: '#ffc107' }} />}
                        emptyIcon={<StarIcon fontSize="inherit" sx={{ color: '#e0e0e0' }} />}
                        sx={{ mt: 0.5 }}
                      />
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
                        sx={{
                          width: 100,
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 1,
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'scale(1.05)' }
                        }}
                        onClick={() => window.open(review.image, '_blank')}
                      />
                    </Box>
                  )}
                </Paper>
              ))}
            </Stack>

            {/* Phân trang đánh giá */}
            {reviewsPagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={reviewsPagination.totalPages}
                  page={reviewsPagination.currentPage}
                  onChange={handleReviewPageChange}
                  color="error"
                  size="medium"
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
