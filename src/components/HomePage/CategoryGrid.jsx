import { useState, useEffect } from 'react'
import { Box, Container, Typography, Grid } from '@mui/material'
import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { getCategoryAPI } from '~/apis'

function CategoryGrid() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getCategoryAPI()
      .then((res) => {
        const categoriesData = res?.categories || res || []
        setCategories(Array.isArray(categoriesData) ? categoriesData.slice(0, 6) : [])
      })
      .catch((err) => console.log('Lỗi tải danh mục:', err))
  }, [])

  // Colors cho các ô danh mục
  const colors = [
    { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { bg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' }
  ]

  return (
    <Box sx={{ mb: 5 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ borderLeft: '5px solid #d32f2f', pl: 2 }}
          >
            Danh Mục Sản Phẩm
          </Typography>
          <Typography
            component={Link}
            to="/categories"
            sx={{
              color: 'error.main',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Xem tất cả <ArrowForwardIcon fontSize="small" />
          </Typography>
        </Box>

        {/* Grid Categories */}
        <Grid container spacing={2}>
          {categories.map((category, index) => (
            <Grid item xs={6} sm={4} md={2} key={category._id}>
              <Box
                component={Link}
                to={`/category/${category._id}`}
                sx={{
                  position: 'relative',
                  display: 'block',
                  height: 140,
                  borderRadius: 2,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  background: colors[index % colors.length].bg,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    '& .category-overlay': {
                      opacity: 1
                    },
                    '& .category-icon': {
                      transform: 'scale(1.1)'
                    }
                  }
                }}
              >
                {/* Background Image */}
                {category.image && (
                  <Box
                    component="img"
                    src={category.image}
                    alt={category.name}
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.3
                    }}
                  />
                )}

                {/* Overlay */}
                <Box
                  className="category-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.4)',
                    opacity: 0.5,
                    transition: 'opacity 0.3s ease'
                  }}
                />

                {/* Content */}
                <Box
                  sx={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  {/* Icon placeholder */}
                  <Box
                    className="category-icon"
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                      transition: 'transform 0.3s ease',
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {category.name?.charAt(0)?.toUpperCase() || '📱'}
                  </Box>

                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      fontSize: { xs: '0.9rem', md: '1rem' }
                    }}
                  >
                    {category.name}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.9,
                      mt: 0.5,
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    Xem ngay →
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default CategoryGrid
