import { useState, useEffect } from 'react'
import { Box, Container, Typography, Grid, Button } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ProductCard from '../Product/ProductCard'
import { getProductsAPI } from '~/apis'

// Mock data - trong thực tế sẽ lấy từ API với filter sale
const mockFlashSaleProducts = [
  {
    _id: '1',
    name: 'iPhone 15 Pro Max 256GB',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    basePrice: 34990000,
    sold: 1250,
    slug: 'iphone-15-pro-max'
  },
  {
    _id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
    basePrice: 29990000,
    sold: 890,
    slug: 'samsung-galaxy-s24-ultra'
  },
  {
    _id: '3',
    name: 'Xiaomi 14 Pro',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
    basePrice: 15990000,
    sold: 560,
    slug: 'xiaomi-14-pro'
  },
  {
    _id: '4',
    name: 'OPPO Find X7 Pro',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
    basePrice: 18990000,
    sold: 320,
    slug: 'oppo-find-x7-pro'
  }
]

function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  })

  // Đếm ngược
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes--
          } else {
            minutes = 59
            if (hours > 0) {
              hours--
            } else {
              hours = 23
            }
          }
        }

        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (num) => num.toString().padStart(2, '0')

  // Calculate discount price (mock: giảm 15%)
  const getDiscountPrice = (price) => {
    return Math.round(price * 0.85)
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Container maxWidth="lg">
        {/* Header Flash Sale */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'error.main'
            }}>
              <LocalFireDepartmentIcon sx={{ fontSize: 40 }} />
              <Typography variant="h4" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
                Flash Sale
              </Typography>
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: '#333',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 1
            }}>
              <AccessTimeIcon sx={{ fontSize: 20 }} />
              <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                <Box sx={{
                  bgcolor: 'white',
                  color: '#333',
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 0.5,
                  fontWeight: 'bold',
                  minWidth: 32,
                  textAlign: 'center'
                }}>
                  {formatTime(timeLeft.hours)}
                </Box>
                <Typography fontWeight="bold">:</Typography>
                <Box sx={{
                  bgcolor: 'white',
                  color: '#333',
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 0.5,
                  fontWeight: 'bold',
                  minWidth: 32,
                  textAlign: 'center'
                }}>
                  {formatTime(timeLeft.minutes)}
                </Box>
                <Typography fontWeight="bold">:</Typography>
                <Box sx={{
                  bgcolor: 'white',
                  color: '#333',
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 0.5,
                  fontWeight: 'bold',
                  minWidth: 32,
                  textAlign: 'center',
                  animation: 'pulse 1s infinite'
                }}>
                  {formatTime(timeLeft.seconds)}
                </Box>
              </Box>
            </Box>
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
        <Grid container spacing={2}>
          {mockFlashSaleProducts.map((product) => (
            <Grid item xs={6} sm={4} md={3} key={product._id}>
              <Box sx={{
                position: 'relative',
                bgcolor: 'white',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }
              }}>
                {/* Badge Giảm giá */}
                <Box sx={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  zIndex: 1,
                  bgcolor: 'error.main',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  -15%
                </Box>

                {/* Discount Bar */}
                <Box sx={{
                  bgcolor: '#ffeb3b',
                  py: 0.5,
                  textAlign: 'center'
                }}>
                  <Typography variant="caption" fontWeight="bold" color="#333">
                    🔥 Ưu đãi giới hạn
                  </Typography>
                </Box>

                {/* Product Image */}
                <Box
                  component="img"
                  src={product.image}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: 180,
                    objectFit: 'contain',
                    p: 2,
                    cursor: 'pointer'
                  }}
                />

                {/* Product Info */}
                <Box sx={{ p: 2, pt: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      mb: 1,
                      height: 40,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {product.name}
                  </Typography>

                  {/* Prices */}
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="h6"
                      color="error.main"
                      fontWeight="bold"
                      sx={{ fontSize: '1.1rem' }}
                    >
                      {new Intl.NumberFormat('vi-VN').format(getDiscountPrice(product.basePrice))}đ
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textDecoration: 'line-through', fontSize: '0.8rem' }}
                    >
                      {new Intl.NumberFormat('vi-VN').format(product.basePrice)}đ
                    </Typography>
                  </Box>

                  {/* Progress Bar */}
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{
                      height: 8,
                      bgcolor: '#e0e0e0',
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{
                        width: `${Math.min((product.sold / 1500) * 100, 100)}%`,
                        height: '100%',
                        bgcolor: 'error.main',
                        borderRadius: 4
                      }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Đã bán {product.sold}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </Box>
  )
}

export default FlashSale
