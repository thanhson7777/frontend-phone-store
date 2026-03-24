import { Box, Container, Typography } from '@mui/material'
import Slider from 'react-slick'
import logo1 from '~/assets/logo_branch/logo1.jpg'
import logo2 from '~/assets/logo_branch/logo2.jpg'
import logo3 from '~/assets/logo_branch/logo3.jpg'
import logo4 from '~/assets/logo_branch/logo4.jpg'
import logo5 from '~/assets/logo_branch/logo5.jpg'


// Mock brand logos - trong thực tế sẽ lấy từ API
const brands = [
  { id: 1, name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { id: 2, name: 'Samsung', logo: logo1 },
  { id: 3, name: 'Xiaomi', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg' },
  { id: 4, name: 'OPPO', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/OPPO_LOGO_2019.svg' },
  { id: 5, name: 'Vivo', logo: logo2 },
  { id: 6, name: 'Realme', logo: logo3 },
  { id: 7, name: 'Nokia', logo: logo4 },
  { id: 8, name: 'OnePlus', logo: logo5 }
]

function BrandCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2
        }
      }
    ]
  }

  return (
    <Box sx={{ bgcolor: 'white', py: 4, mb: 4 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ textAlign: 'center', mb: 4, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 2 }}
        >
          Thương Hiệu Nổi Tiếng
        </Typography>

        <Slider {...settings}>
          {brands.map((brand) => (
            <Box
              key={brand.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 80,
                px: 3,
                opacity: 0.6,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.1)'
                },
                '& img': {
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  filter: 'grayscale(100%)',
                  transition: 'filter 0.3s ease'
                },
                '&:hover img': {
                  filter: 'grayscale(0%)'
                }
              }}
            >
              <Box
                component="img"
                src={brand.logo}
                alt={brand.name}
                sx={{ maxWidth: 120, maxHeight: 50 }}
              />
            </Box>
          ))}
        </Slider>
      </Container>
    </Box>
  )
}

export default BrandCarousel
