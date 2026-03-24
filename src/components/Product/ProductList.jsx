import { Box, Typography, Grid, Select, MenuItem, FormControl, InputLabel, Pagination, Stack } from '@mui/material'
import ProductCard from './ProductCard'
import { useState, useEffect } from 'react'
import { getProductsAPI, getCategoryAPI } from '~/apis'
import { useSearchParams } from 'react-router-dom'
import FilterListIcon from '@mui/icons-material/FilterList'

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 12
  })

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt_desc'
  })

  useEffect(() => {
    getCategoryAPI()
      .then((res) => {
        setCategories(res?.categories || res || [])
      })
      .catch((err) => { console.log('Lỗi ở category: ', err) })
  }, [])

  useEffect(() => {
    const params = {}
    if (filters.search) params.search = filters.search
    if (filters.categoryId) params.categoryId = filters.categoryId
    if (filters.brand) params.brand = filters.brand
    if (filters.minPrice) params.minPrice = filters.minPrice
    if (filters.maxPrice) params.maxPrice = filters.maxPrice
    if (filters.sortBy) params.sortBy = filters.sortBy
    params.page = pagination.currentPage
    params.itemsPerPage = pagination.limit

    setLoading(true)
    getProductsAPI(params)
      .then((res) => {
        setProducts(res.products || [])
        if (res.pagination) {
          setPagination(prev => ({
            ...prev,
            currentPage: res.pagination.currentPage || 1,
            totalPages: res.pagination.totalPages || 1,
            totalRecords: res.pagination.totalRecords || 0
          }))
        }
      })
      .catch((err) => { console.log('Lỗi ở product: ', err) })
      .finally(() => setLoading(false))
  }, [filters, pagination.currentPage])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const searchValue = e.target.search.value
    handleFilterChange('search', searchValue)
  }

  const handlePageChange = (event, page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      categoryId: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt_desc'
    })
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const hasActiveFilters = filters.search || filters.categoryId || filters.brand || filters.minPrice || filters.maxPrice

  return (
    <Box sx={{ my: 4 }}>
      {/* Tiêu đề danh sách */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '3px solid #d32f2f', display: 'inline-block', pb: 0.5 }}>
          {filters.search ? `Kết quả tìm kiếm: "${filters.search}"` : 'Điện Thoại Nổi Bật'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {pagination.totalRecords} sản phẩm
        </Typography>
      </Box>

      {/* Bộ lọc */}
      <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FilterListIcon color="error" />
          <Typography variant="subtitle1" fontWeight="bold">Bộ lọc</Typography>
          {hasActiveFilters && (
            <Typography
              variant="body2"
              color="error"
              sx={{ cursor: 'pointer', ml: 'auto', '&:hover': { textDecoration: 'underline' } }}
              onClick={handleClearFilters}
            >
              Xóa bộ lọc
            </Typography>
          )}
        </Box>

        <Grid container spacing={2} alignItems="center">
          {/* Tìm kiếm */}
          <Grid item xs={12} md={3}>
            <form onSubmit={handleSearch}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <input
                  name="search"
                  placeholder="Tìm theo tên..."
                  defaultValue={filters.search}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Tìm
                </button>
              </Box>
            </form>
          </Grid>

          {/* Danh mục */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={filters.categoryId}
                label="Danh mục"
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {(categories?.categories || categories || []).map(cat => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sắp xếp */}
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Sắp xếp theo</InputLabel>
              <Select
                value={filters.sortBy}
                label="Sắp xếp theo"
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <MenuItem value="createdAt_desc">Mới nhất</MenuItem>
                <MenuItem value="createdAt_asc">Cũ nhất</MenuItem>
                <MenuItem value="price_asc">Giá: Thấp đến Cao</MenuItem>
                <MenuItem value="price_desc">Giá: Cao đến Thấp</MenuItem>
                <MenuItem value="name">Tên A-Z</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Khoảng giá */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Giá từ"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                style={{
                  width: '100px',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <Typography>-</Typography>
              <input
                type="number"
                placeholder="đến"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                style={{
                  width: '100px',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <Typography variant="body2" color="text.secondary">VNĐ</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Lưới sản phẩm (Grid System) */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography>Đang tải sản phẩm...</Typography>
        </Box>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f8f9fa', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy sản phẩm nào
          </Typography>
          {hasActiveFilters && (
            <Typography
              variant="body2"
              color="error"
              sx={{ cursor: 'pointer', mt: 2, '&:hover': { textDecoration: 'underline' } }}
              onClick={handleClearFilters}
            >
              Xóa bộ lọc và thử lại
            </Typography>
          )}
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {/* Phân trang */}
          {pagination.totalPages > 1 && (
            <Stack spacing={2} sx={{ mt: 4, alignItems: 'center' }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                color="error"
                size="large"
                showFirstButton
                showLastButton
              />
              <Typography variant="body2" color="text.secondary">
                Trang {pagination.currentPage} / {pagination.totalPages}
              </Typography>
            </Stack>
          )}
        </>
      )}
    </Box>
  )
}

export default ProductList
