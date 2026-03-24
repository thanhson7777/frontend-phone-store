import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Box, Container, Typography, Grid, Select, MenuItem,
  FormControl, IconButton, Skeleton, Breadcrumbs, Link, Badge,
  Button, Chip, CircularProgress
} from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import TuneIcon from '@mui/icons-material/Tune'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import FilterSidebar, { MobileFilterDrawer } from '~/components/Products/FilterSidebar'
import ActiveFilters from '~/components/Products/ActiveFilters'
import ProductCard from '~/components/Product/ProductCard'
import ProductListView from '~/components/Products/ProductListView'
import { getProductsAPI, getCategoryAPI } from '~/apis'
import { useSearchParams, Link as RouterLink } from 'react-router-dom'

const ITEMS_PER_PAGE = 12

// Sort options - phải khớp với backend
const sortOptions = [
  { value: 'createdAt_desc', label: 'Mới nhất' },
  { value: 'basePrice_asc', label: 'Giá: Thấp → Cao' },
  { value: 'basePrice_desc', label: 'Giá: Cao → Thấp' },
  { value: 'name_asc', label: 'Tên: A → Z' },
  { value: 'sold_desc', label: 'Bán chạy nhất' }
]

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  // Mobile filter drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // View mode
  const [viewMode, setViewMode] = useState('grid')

  // Sort - mặc định theo createdAt desc
  const [sortBy, setSortBy] = useState('createdAt_desc')

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categories: searchParams.get('category') ? [searchParams.get('category')] : [],
    brands: [],
    colors: [],
    rams: [],
    storages: [],
    priceRange: [0, 999999999],
    rating: 0
  })

  // Debounce search - lưu search input tạm thời
  const [searchInput, setSearchInput] = useState(filters.search)

  // Debounce effect - sau 1s không nhập mới cập nhật filters.search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchInput }))
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchInput, filters.search])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.categories.length > 0) params.set('category', filters.categories[0])
    setSearchParams(params, { replace: true })
  }, [filters.search, filters.categories, filters.categories.length])

  // Observer ref for infinite scroll
  const observerRef = useRef()
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [loading, hasMore, loadingMore]
  )

  // Fetch products from API
  const fetchProducts = async (pageNum, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    try {
      // Build params KHỚP VỚI BACKEND
      const params = {
        page: pageNum,
        itemsPerPage: ITEMS_PER_PAGE
      }

      // Thêm filters
      if (filters.search) params.search = filters.search
      if (filters.categories.length > 0) params.categoryId = filters.categories[0]
      if (filters.brands.length > 0) params.brand = filters.brands[0]

      // Price range
      if (filters.priceRange[0] > 0) params.minPrice = filters.priceRange[0]
      if (filters.priceRange[1] < 999999999) params.maxPrice = filters.priceRange[1]

      // Sort - Backend dùng sortBy với format: price_asc, price_desc, name, hoặc mặc định createdAt
      if (sortBy === 'basePrice_asc') params.sortBy = 'price_asc'
      else if (sortBy === 'basePrice_desc') params.sortBy = 'price_desc'
      else if (sortBy === 'name_asc') params.sortBy = 'name'
      else if (sortBy === 'sold_desc') params.sortBy = 'sold'
      // createdAt_desc là mặc định, không cần gửi

      console.log('🔍 Fetching products with params:', params)

      const res = await getProductsAPI(params)
      const newProducts = res.products || []
      const total = res.pagination?.totalRecords || res.totalProducts || 0

      if (isLoadMore) {
        setProducts((prev) => [...prev, ...newProducts])
      } else {
        setProducts(newProducts)
      }

      setTotalProducts(total)
      setHasMore(pageNum * ITEMS_PER_PAGE < total)
    } catch (error) {
      console.error('❌ Error fetching products:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Initial load & when filters/sort change
  useEffect(() => {
    setPage(1)
    fetchProducts(1)
  }, [filters.search, filters.categories, filters.brands, filters.priceRange, sortBy])

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchProducts(page, true)
    }
  }, [page])

  // Count active filters
  const activeFilterCount =
    filters.brands.length +
    filters.colors.length +
    filters.rams.length +
    filters.storages.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 999999999 ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0)

  // Handle local search - cập nhật searchInput (debounce sẽ tự động cập nhật filters.search sau 1s)
  const handleLocalSearch = (value) => {
    setSearchInput(value)
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs
          sx={{
            mb: 3,
            flexWrap: 'nowrap',
            '& .MuiBreadcrumbs-li': { maxWidth: { xs: '45%', sm: 'none' } },
            '& .MuiBreadcrumbs-separator': { mx: 0.5 }
          }}
        >
          <Link component={RouterLink} to="/" color="inherit" underline="hover">
            Trang chủ
          </Link>
          <Typography color="text.primary" noWrap component="span">
            Sản phẩm
          </Typography>
          {filters.search && (
            <Typography color="text.primary" noWrap sx={{ maxWidth: { xs: 200, sm: 360 } }} title={filters.search}>
              {`"${filters.search}"`}
            </Typography>
          )}
        </Breadcrumbs>

        {/* Page Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            {filters.search ? `Kết quả tìm kiếm "${filters.search}"` : 'Tất Cả Sản Phẩm'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {loading ? 'Đang tìm...' : `Có ${totalProducts} sản phẩm`}
          </Typography>
        </Box>

        {/* Main Layout */}
        <Grid container spacing={3}>
          {/* Sidebar - Desktop */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            <Box sx={{ position: 'sticky', top: 80 }}>
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </Box>
          </Grid>

          {/* Content */}
          <Grid item xs={12} md={9}>
            {/* Top Bar */}
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                p: 2,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              {/* Left side */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Mobile Filter Button */}
                <IconButton
                  onClick={() => setMobileFilterOpen(true)}
                  sx={{
                    display: { md: 'none' },
                    bgcolor: activeFilterCount > 0 ? 'error.main' : '#f5f5f5',
                    color: activeFilterCount > 0 ? 'white' : 'text.primary',
                    '&:hover': { bgcolor: activeFilterCount > 0 ? 'error.dark' : '#e0e0e0' }
                  }}
                >
                  <Badge badgeContent={activeFilterCount} color="error">
                    <TuneIcon />
                  </Badge>
                </IconButton>

                {/* Local Search */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: '#f5f5f5',
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                    width: { xs: 150, sm: 200 }
                  }}
                >
                  <SearchIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <input
                    type="text"
                    placeholder="Lọc nhanh..."
                    value={searchInput}
                    onChange={(e) => handleLocalSearch(e.target.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      width: '100%',
                      fontSize: '0.875rem'
                    }}
                  />
                  {searchInput && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearchInput('')
                        setFilters(prev => ({ ...prev, search: '' }))
                      }}
                      sx={{ p: 0.25 }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>

              {/* Right side */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Results count */}
                <Typography variant="body2" color="text.secondary">
                  {products.length} / {totalProducts}
                </Typography>

                {/* Sort Dropdown */}
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    displayEmpty
                    startAdornment={
                      <TuneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    }
                    sx={{ '& .MuiSelect-select': { py: 1 } }}
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* View Toggle */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton
                    onClick={() => setViewMode('grid')}
                    sx={{
                      bgcolor: viewMode === 'grid' ? 'error.main' : '#f5f5f5',
                      color: viewMode === 'grid' ? 'white' : 'text.secondary',
                      '&:hover': { bgcolor: viewMode === 'grid' ? 'error.dark' : '#e0e0e0' }
                    }}
                  >
                    <GridViewIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setViewMode('list')}
                    sx={{
                      bgcolor: viewMode === 'list' ? 'error.main' : '#f5f5f5',
                      color: viewMode === 'list' ? 'white' : 'text.secondary',
                      '&:hover': { bgcolor: viewMode === 'list' ? 'error.dark' : '#e0e0e0' }
                    }}
                  >
                    <ViewListIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Active Filters */}
            <ActiveFilters filters={filters} setFilters={setFilters} />

            {/* Search result info */}
            {searchInput && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: 'rgba(211, 47, 47, 0.1)',
                  borderRadius: 2,
                  p: 2,
                  mb: 2
                }}
              >
                <Typography variant="body2">
                  Kết quả tìm kiếm cho: <strong>"{searchInput}"</strong>
                </Typography>
                <Button
                  size="small"
                  onClick={() => {
                    setSearchInput('')
                    setFilters(prev => ({ ...prev, search: '' }))
                  }}
                  startIcon={<CloseIcon />}
                  sx={{ color: 'error.main' }}
                >
                  Xóa
                </Button>
              </Box>
            )}

            {/* Products Grid/List */}
            {loading ? (
              <Grid container spacing={2}>
                {[...Array(8)].map((_, index) => (
                  <Grid
                    item
                    xs={viewMode === 'list' ? 12 : 6}
                    sm={viewMode === 'list' ? 12 : 4}
                    md={viewMode === 'list' ? 12 : 4}
                    key={index}
                  >
                    <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2 }}>
                      <Skeleton variant="rectangular" height={180} />
                      <Skeleton sx={{ mt: 2 }} />
                      <Skeleton width="60%" />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : viewMode === 'grid' ? (
              <Grid container spacing={2}>
                {products.map((product, index) => (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={4}
                    key={product._id}
                    ref={index === products.length - 1 ? lastProductRef : null}
                  >
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <ProductListView
                products={products}
                lastProductRef={lastProductRef}
              />
            )}

            {/* Loading More */}
            {loadingMore && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={24} color="error" />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Đang tải thêm sản phẩm...
                </Typography>
              </Box>
            )}

            {/* No More Products */}
            {!hasMore && products.length > 0 && (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 4,
                  color: 'text.secondary',
                  borderTop: '1px solid #e0e0e0',
                  mt: 2
                }}
              >
                <Typography variant="body2">
                  ✓ Đã hiển thị tất cả {totalProducts} sản phẩm
                </Typography>
              </Box>
            )}

            {/* No Products */}
            {!loading && products.length === 0 && (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  bgcolor: 'white',
                  borderRadius: 2
                }}
              >
                <Box sx={{ fontSize: '4rem', mb: 2 }}>🔍</Box>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Không tìm thấy sản phẩm nào
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setSearchInput('')
                    setFilters({
                      search: '',
                      categories: [],
                      brands: [],
                      colors: [],
                      rams: [],
                      storages: [],
                      priceRange: [0, 999999999],
                      rating: 0
                    })
                    setSortBy('createdAt_desc')
                  }}
                >
                  Xóa tất cả bộ lọc
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </Box>
  )
}

export default ProductsPage
