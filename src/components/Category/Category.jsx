// src/components/CategoryList.jsx
import { Box, Typography, Avatar, Tooltip } from '@mui/material'
import { getCategoryAPI } from '~/apis'
import { useState, useEffect } from 'react'
import PageLoadingSpinner from '../Loading/PageLoadingSpinner'
import { Link } from 'react-router-dom'

function CategoryList() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategoryAPI()
      .then((res) => {
        setCategories(res || [])
      })
      .catch((err) => { console.log('Lỗi ở category: ', err) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <PageLoadingSpinner caption="Đang tải..." />
  }

  return (
    <Box sx={{ my: 4, px: 2 }}>
      {/* Tiêu đề của khu vực */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          mb: 3,
          textTransform: 'uppercase',
          color: 'error.main',
          textAlign: 'center',
          letterSpacing: 1
        }}
      >
        Danh Mục Nổi Bật
      </Typography>

      {/* Khung chứa các Category: Nằm dọc */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column', // Nằm dọc
        gap: { xs: 2, md: 3 },
        alignItems: 'center', // Center items
        pb: 2,
        px: 1,
        maxHeight: '400px', // Giới hạn height nếu cần scroll
        overflowY: 'auto', // Scroll dọc nếu dài
        '&::-webkit-scrollbar': {
          width: '6px',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          '&:hover': { backgroundColor: '#d0d0d0' }
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }
      }}>

        {/* Lặp qua mảng dữ liệu để in ra màn hình */}
        {categories?.map((category) => (
          <Tooltip key={category._id} title={`Khám phá ${category.name}`} arrow>
            <Box
              key={category._id}
              component={Link}
              to={`/category/${category._id}`}
              sx={{
                display: 'flex',
                flexDirection: 'column', // Image trên, text dưới
                alignItems: 'center',
                minWidth: { xs: '100px', md: '120px' },
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                borderRadius: 2,
                p: 1,
                '&:hover': {
                  transform: 'scale(1.05) translateY(-3px)', // Hover scale và lift
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  '& .category-name': { color: 'error.main' }
                }
              }}
            >
              {/* Vòng tròn Avatar chứa Logo hãng */}
              <Avatar
                src={category?.image || ''}
                alt={category?.name}
                sx={{
                  width: { xs: 60, md: 70 },
                  height: { xs: 60, md: 70 },
                  mb: 1, // Gap với text
                  bgcolor: category?.image ? 'white' : 'linear-gradient(45deg, #d32f2f, #f44336)', // Gradient nếu không có image
                  color: 'white',
                  border: '2px solid #e0e0e0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'border-color 0.3s ease',
                  '&:hover': { borderColor: 'error.main' },
                  // Chỉnh ảnh bên trong cho vừa vặn, không bị méo
                  '& img': { objectFit: 'contain', width: '70%', height: '70%' }
                }}
              >
                {/* Nếu hãng nào không có hình logo, tự động lấy chữ cái đầu in hoa */}
                {!category.image && category.name.charAt(0).toUpperCase()}
              </Avatar>

              {/* Tên hãng */}
              <Typography
                className="category-name"
                variant="body2"
                sx={{
                  fontWeight: 600,
                  textAlign: 'center',
                  transition: 'color 0.3s ease',
                  fontSize: { xs: '0.8rem', md: '0.9rem' },
                  whiteSpace: 'nowrap', // Tránh wrap text
                  overflow: 'hidden',
                  textOverflow: 'ellipsis' // Ellipsis nếu text dài
                }}
              >
                {category.name}
              </Typography>
            </Box>
          </Tooltip>
        ))}

      </Box>
    </Box>
  )
}

export default CategoryList