import { Box, Typography, Rating, Button, Chip, Tooltip } from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Link } from 'react-router-dom'
import { getProductColorSwatches } from '~/utils/productColorUtils'

function ProductListView({ products }) {
  if (!products || products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">Không có sản phẩm nào phù hợp</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {products.map((product) => (
        <Box
          key={product._id}
          sx={{
            display: 'flex',
            bgcolor: 'white',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          {/* Image */}
          <Box
            component={Link}
            to={`/product/${product._id}`}
            sx={{
              width: 220,
              minHeight: 220,
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              component="img"
              src={product.image || 'https://via.placeholder.com/220'}
              alt={product.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                p: 2,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            />

            {/* Badges */}
            {product.discount && (
              <Chip
                label={`-${product.discount}%`}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  bgcolor: 'error.main',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            )}

            {product.isNew && (
              <Chip
                label="Mới"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  bgcolor: 'success.main',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            )}
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
            {/* Title & Rating */}
            <Box sx={{ flex: 1 }}>
              <Typography
                component={Link}
                to={`/product/${product._id}`}
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  color: 'text.primary',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mb: 1,
                  '&:hover': { color: 'error.main' }
                }}
              >
                {product.name}
              </Typography>

              {/* Color swatches */}
              {(() => {
                const colors = getProductColorSwatches(product)
                if (!colors.length) return null
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
                    {colors.slice(0, 6).map((c) => (
                      <Tooltip key={c.name} title={c.name} arrow placement="top">
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            bgcolor: c.hex,
                            border: '2px solid white',
                            boxShadow: '0 0 0 1px #e0e0e0'
                          }}
                        />
                      </Tooltip>
                    ))}
                    {colors.length > 6 && (
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.25 }}>
                        +{colors.length - 6}
                      </Typography>
                    )}
                  </Box>
                )
              })()}

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Rating value={product.rating || 4} readOnly size="small" />
                <Typography variant="caption" color="text.secondary">
                  ({product.reviewCount || 0} đánh giá)
                </Typography>
              </Box>

              {/* Description */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mb: 2
                }}
              >
                {product.description || 'Điện thoại thông minh với nhiều tính năng nổi bật'}
              </Typography>

              {/* Specs */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {product.screen && (
                  <Chip label={product.screen} size="small" variant="outlined" />
                )}
                {product.camera && (
                  <Chip label={product.camera} size="small" variant="outlined" />
                )}
                {product.battery && (
                  <Chip label={product.battery} size="small" variant="outlined" />
                )}
                {product.storage && (
                  <Chip label={product.storage} size="small" variant="outlined" />
                )}
              </Box>
            </Box>

            {/* Price & Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Price */}
              <Box>
                <Typography
                  variant="h5"
                  color="error.main"
                  fontWeight="bold"
                >
                  {new Intl.NumberFormat('vi-VN').format(product.basePrice)}đ
                </Typography>
                {product.basePrice !== product.originalPrice && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    {new Intl.NumberFormat('vi-VN').format(product.originalPrice)}đ
                  </Typography>
                )}
              </Box>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityIcon />}
                  component={Link}
                  to={`/product/${product._id}`}
                >
                  Chi tiết
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  startIcon={<AddShoppingCartIcon />}
                >
                  Thêm vào giỏ
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default ProductListView
