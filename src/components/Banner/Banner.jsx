import React, { useState, useEffect } from 'react'
import Slider from 'react-slick'
import { Box, Typography, useTheme } from '@mui/material'

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { getActiveBannersAPI } from '~/apis'

const FALLBACK_BANNERS = [
  {
    _id: 'fallback-1',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1600&q=80',
    title: 'Khám Phá Điện Thoại Mới Nhất',
    subtitle: 'Công nghệ tiên tiến, thiết kế sang trọng. Mua ngay hôm nay!'
  },
  {
    _id: 'fallback-2',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1600&q=80',
    title: 'Ưu Đãi Đặc Biệt Cho Bạn',
    subtitle: 'Giảm giá lên đến 50% cho các mẫu flagship.'
  },
  {
    _id: 'fallback-3',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1600&q=80',
    title: 'Trải Nghiệm Màn Hình Siêu Sắc Nét',
    subtitle: 'OLED 4K, màu sắc sống động như thật.'
  }
]

function Banner() {
  const theme = useTheme()
  const [bannerSlides, setBannerSlides] = useState(FALLBACK_BANNERS)
  const [imageErrors, setImageErrors] = useState({})

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getActiveBannersAPI()
        console.log(data)
        if (Array.isArray(data) && data.length > 0) {
          setBannerSlides(data)
        }
      } catch {
        // giữ fallback nếu API lỗi
      }
    }
    fetchBanners()
  }, [])

  const settings = {
    dots: true,
    infinite: bannerSlides.length > 1,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    fade: true,
    pauseOnHover: true,
    customPaging: () => (
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.5)',
          transition: 'background-color 0.3s ease',
          '&:hover': { backgroundColor: theme.palette.error.main }
        }}
      />
    ),
    dotsClass: 'slick-dots custom-dots'
  }

  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }))
  }

  return (
    // Box bọc ngoài, thêm position relative để dots nằm gọn, và box shadow
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        mb: 5,
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: '8px'
      }}
    >
      <Slider {...settings}>
        {bannerSlides.map((slide, index) => (
          <Box key={index} sx={{ position: 'relative', outline: 'none' }}>
            {/* Ảnh nền */}
            <Box
              component="img"
              src={imageErrors[slide._id] ? '/path/to/fallback-image.jpg' : slide.image}
              alt={`Banner slide ${index + 1}: ${slide.title}`}
              loading="lazy"
              onError={() => handleImageError(slide._id)}
              sx={{
                width: '100%',
                height: { xs: '250px', sm: '350px', md: '500px' },
                objectFit: 'cover',
                display: 'block',
                borderRadius: '8px'
              }}
            />
            {/* Overlay gradient để text nổi bật */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: 2,
                transition: 'opacity 0.5s ease'
              }}
            >
              {/* Text overlay */}
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '2.5rem' },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  mb: 1
                }}
              >
                {slide.title}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 400,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  maxWidth: '600px'
                }}
              >
                {slide.subtitle}
              </Typography>
            </Box>
          </Box>
        ))}
      </Slider>
      {/* Tùy chỉnh dots CSS (thêm vào file CSS global nếu cần) */}
      <style>{`
        .custom-dots {
          bottom: 20px !important;
        }
        .custom-dots li button:before {
          display: none; 
        }
      `}</style>
    </Box>
  )
}

export default Banner