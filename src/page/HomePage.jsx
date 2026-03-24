import { Box } from '@mui/material'
import Banner from '~/components/Banner/Banner'
import TrustBadges from '~/components/HomePage/TrustBadges'
import FlashSale from '~/components/HomePage/FlashSale'
import CategoryGrid from '~/components/HomePage/CategoryGrid'
import FeaturedProducts from '~/components/HomePage/FeaturedProducts'
import BrandCarousel from '~/components/HomePage/BrandCarousel'
import ProductList from '~/components/Product/ProductList'
import Newsletter from '~/components/HomePage/Newsletter'

function HomePage() {
  return (
    <Box>
      {/* Banner Slider */}
      <Banner />

      {/* Trust Badges - Cam kết mua sắm */}
      <TrustBadges />

      {/* Flash Sale - Khuyến mãi */}
      <FlashSale />

      {/* Category Grid - Danh mục nổi bật */}
      <CategoryGrid />

      {/* Brand Carousel - Thương hiệu */}
      <BrandCarousel />

      {/* Featured Products - Sản phẩm nổi bật */}
      <FeaturedProducts />

      {/* All Products with Filters - Tất cả sản phẩm */}
      <Box sx={{ px: { xs: 2, md: 3 } }}>
        <ProductList />
      </Box>

      {/* Newsletter - Đăng ký nhận tin */}
      <Newsletter />
    </Box>
  )
}

export default HomePage
