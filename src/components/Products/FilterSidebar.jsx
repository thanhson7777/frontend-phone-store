import { useState, useEffect, useMemo } from 'react'
import {
  Box, Typography, Collapse, FormControlLabel, Checkbox,
  Slider, TextField, Button, Rating, Chip, Badge,
  InputAdornment, Drawer, IconButton, Divider
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import FilterListIcon from '@mui/icons-material/FilterList'
import DoneIcon from '@mui/icons-material/Done'
import { getCategoryAPI } from '~/apis'

// Price range presets
const pricePresets = [
  { label: 'Dưới 3 triệu', min: 0, max: 3000000 },
  { label: '3 - 5 triệu', min: 3000000, max: 5000000 },
  { label: '5 - 10 triệu', min: 5000000, max: 10000000 },
  { label: '10 - 15 triệu', min: 10000000, max: 15000000 },
  { label: '15 - 20 triệu', min: 15000000, max: 20000000 },
  { label: 'Trên 20 triệu', min: 20000000, max: 999999999 }
]

// Brands with icons
const brands = [
  { id: 'apple', name: 'Apple', color: '#555555' },
  { id: 'samsung', name: 'Samsung', color: '#1428A0' },
  { id: 'xiaomi', name: 'Xiaomi', color: '#FF6900' },
  { id: 'oppo', name: 'OPPO', color: '#00A34B' },
  { id: 'vivo', name: 'Vivo', color: '#415FFF' },
  { id: 'realme', name: 'Realme', color: '#F37C20' },
  { id: 'nokia', name: 'Nokia', color: '#0071BD' },
  { id: 'oneplus', name: 'OnePlus', color: '#F5010C' }
]

// Colors with hex
const colors = [
  { id: 'black', name: 'Đen', hex: '#1a1a1a' },
  { id: 'white', name: 'Trắng', hex: '#F5F5F5' },
  { id: 'blue', name: 'Xanh dương', hex: '#2196F3' },
  { id: 'red', name: 'Đỏ', hex: '#E53935' },
  { id: 'gold', name: 'Vàng', hex: '#FFD700' },
  { id: 'green', name: 'Xanh lá', hex: '#43A047' },
  { id: 'purple', name: 'Tím', hex: '#9C27B0' },
  { id: 'pink', name: 'Hồng', hex: '#E91E63' },
  { id: 'gray', name: 'Xám', hex: '#757575' }
]

// RAM options
const ramOptions = ['4GB', '6GB', '8GB', '12GB', '16GB']

// Storage options
const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB']

function FilterSection({ title, children, defaultOpen = true, badge = 0 }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Box sx={{ mb: 0.5 }}>
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          py: 1.5,
          px: 1,
          borderRadius: 1,
          '&:hover': { bgcolor: '#f5f5f5' }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {title}
          </Typography>
          {badge > 0 && (
            <Chip
              label={badge}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                bgcolor: 'error.main',
                color: 'white'
              }}
            />
          )}
        </Box>
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>
      <Collapse in={open}>
        <Box sx={{ py: 1.5, px: 1 }}>{children}</Box>
      </Collapse>
    </Box>
  )
}

// FilterSidebar Component
function FilterSidebar({ filters, setFilters, isMobile = false, onClose }) {
  const [categories, setCategories] = useState([])
  const [searchCategory, setSearchCategory] = useState('')
  const [searchBrand, setSearchBrand] = useState('')

  // Fetch categories
  useEffect(() => {
    getCategoryAPI()
      .then((res) => {
        const categoriesData = res?.categories || res || []
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      })
      .catch((err) => console.log('Lỗi tải danh mục:', err))
  }, [])

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchCategory) return categories
    return categories.filter(cat =>
      cat.name.toLowerCase().includes(searchCategory.toLowerCase())
    )
  }, [categories, searchCategory])

  // Filtered brands
  const filteredBrands = useMemo(() => {
    if (!searchBrand) return brands
    return brands.filter(brand =>
      brand.name.toLowerCase().includes(searchBrand.toLowerCase())
    )
  }, [searchBrand])

  // Toggle handlers
  const handleCategoryChange = (categoryId) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId]
    setFilters({ ...filters, categories: newCategories })
  }

  const handleBrandChange = (brandId) => {
    const newBrands = filters.brands.includes(brandId)
      ? filters.brands.filter((b) => b !== brandId)
      : [...filters.brands, brandId]
    setFilters({ ...filters, brands: newBrands })
  }

  const handleColorChange = (colorId) => {
    const newColors = filters.colors.includes(colorId)
      ? filters.colors.filter((c) => c !== colorId)
      : [...filters.colors, colorId]
    setFilters({ ...filters, colors: newColors })
  }

  const handleRamChange = (ram) => {
    const newRams = filters.rams.includes(ram)
      ? filters.rams.filter((r) => r !== ram)
      : [...filters.rams, ram]
    setFilters({ ...filters, rams: newRams })
  }

  const handleStorageChange = (storage) => {
    const newStorages = filters.storages.includes(storage)
      ? filters.storages.filter((s) => s !== storage)
      : [...filters.storages, storage]
    setFilters({ ...filters, storages: newStorages })
  }

  // Price range
  const handlePriceChange = (event, newValue) => {
    setFilters({ ...filters, priceRange: newValue })
  }

  // Rating
  const handleRatingChange = (rating) => {
    setFilters({ ...filters, rating: filters.rating === rating ? 0 : rating })
  }

  // Clear all
  const clearAllFilters = () => {
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
    setSearchCategory('')
    setSearchBrand('')
  }

  // Count active filters
  const activeFilterCount =
    filters.categories.length +
    filters.brands.length +
    filters.colors.length +
    filters.rams.length +
    filters.storages.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 999999999 ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0)

  // Price display
  const formatPrice = (value) => {
    if (value >= 999999999) return '20M+'
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`
    return value.toLocaleString()
  }

  const content = (
    <Box sx={{ p: { xs: 2, md: 0 } }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          pb: 2,
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon color="error" />
          <Typography variant="h6" fontWeight="bold">
            Bộ Lọc
          </Typography>
          {activeFilterCount > 0 && (
            <Chip
              label={`${activeFilterCount} đang chọn`}
              size="small"
              color="error"
              sx={{ height: 22, fontSize: '0.7rem' }}
            />
          )}
        </Box>
        {isMobile && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* Categories */}
      <FilterSection
        title="Danh Mục"
        badge={filters.categories.length}
        defaultOpen={true}
      >
        <TextField
          size="small"
          placeholder="Tìm danh mục..."
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          fullWidth
          sx={{ mb: 1.5 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            )
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, maxHeight: 200, overflow: 'auto' }}>
          {filteredCategories.map((category) => (
            <FormControlLabel
              key={category._id}
              control={
                <Checkbox
                  size="small"
                  checked={filters.categories.includes(category._id)}
                  onChange={() => handleCategoryChange(category._id)}
                  icon={<Box sx={{ width: 18, height: 18, border: '2px solid #ccc', borderRadius: 1 }} />}
                  checkedIcon={
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        bgcolor: 'error.main',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <DoneIcon sx={{ fontSize: 12, color: 'white' }} />
                    </Box>
                  }
                />
              }
              label={
                <Typography variant="body2">
                  {category.name}
                </Typography>
              }
            />
          ))}
          {filteredCategories.length === 0 && (
            <Typography variant="caption" color="text.secondary">
              Không tìm thấy danh mục
            </Typography>
          )}
        </Box>
      </FilterSection>

      {/* Brands */}
      <FilterSection
        title="Thương Hiệu"
        badge={filters.brands.length}
        defaultOpen={true}
      >
        <TextField
          size="small"
          placeholder="Tìm thương hiệu..."
          value={searchBrand}
          onChange={(e) => setSearchBrand(e.target.value)}
          fullWidth
          sx={{ mb: 1.5 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            )
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {filteredBrands.map((brand) => (
            <FormControlLabel
              key={brand.id}
              control={
                <Checkbox
                  size="small"
                  checked={filters.brands.includes(brand.id)}
                  onChange={() => handleBrandChange(brand.id)}
                  icon={<Box sx={{ width: 18, height: 18, border: '2px solid #ccc', borderRadius: 1 }} />}
                  checkedIcon={
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        bgcolor: brand.color,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <DoneIcon sx={{ fontSize: 12, color: 'white' }} />
                    </Box>
                  }
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: filters.brands.includes(brand.id) ? 'bold' : 'normal' }}>
                  {brand.name}
                </Typography>
              }
            />
          ))}
        </Box>
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="Khoảng Giá"
        badge={filters.priceRange[0] > 0 || filters.priceRange[1] < 999999999 ? 1 : 0}
        defaultOpen={true}
      >
        <Box sx={{ px: 0.5 }}>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            min={0}
            max={20000000}
            step={500000}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => formatPrice(value)}
            sx={{
              color: 'error.main',
              '& .MuiSlider-thumb': {
                width: 20,
                height: 20,
                '&:before': { boxShadow: '0 4px 12px rgba(211,47,47,0.3)' }
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
              {formatPrice(filters.priceRange[0])}đ
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
              {formatPrice(filters.priceRange[1])}đ
            </Typography>
          </Box>

          {/* Price presets */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
            {pricePresets.map((preset) => {
              const isActive = filters.priceRange[0] === preset.min && filters.priceRange[1] === preset.max
              return (
                <Chip
                  key={preset.label}
                  label={preset.label}
                  size="small"
                  onClick={() => setFilters({ ...filters, priceRange: [preset.min, preset.max] })}
                  sx={{
                    fontSize: '0.65rem',
                    height: 26,
                    bgcolor: isActive ? 'error.main' : '#f5f5f5',
                    color: isActive ? 'white' : 'text.primary',
                    border: '1px solid',
                    borderColor: isActive ? 'error.main' : 'transparent',
                    '&:hover': {
                      bgcolor: isActive ? 'error.dark' : '#e0e0e0'
                    }
                  }}
                />
              )
            })}
          </Box>
        </Box>
      </FilterSection>

      {/* Colors */}
      <FilterSection
        title="Màu Sắc"
        badge={filters.colors.length}
        defaultOpen={false}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {colors.map((color) => {
            const isSelected = filters.colors.includes(color.id)
            return (
              <Box
                key={color.id}
                onClick={() => handleColorChange(color.id)}
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  bgcolor: color.hex,
                  border: isSelected ? '3px solid #d32f2f' : '2px solid #e0e0e0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  position: 'relative',
                  boxShadow: isSelected ? '0 0 0 2px rgba(211,47,47,0.3)' : 'none',
                  '&:hover': {
                    transform: 'scale(1.15)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }
                }}
                title={color.name}
              >
                {isSelected && (
                  <DoneIcon
                    sx={{
                      fontSize: 16,
                      color: color.id === 'white' || color.id === 'gold' ? 'black' : 'white',
                      fontWeight: 'bold'
                    }}
                  />
                )}
              </Box>
            )
          })}
        </Box>
        {filters.colors.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Đã chọn: {filters.colors.map(c => colors.find(color => color.id === c)?.name).join(', ')}
          </Typography>
        )}
      </FilterSection>

      {/* RAM */}
      <FilterSection
        title="RAM"
        badge={filters.rams.length}
        defaultOpen={false}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {ramOptions.map((ram) => {
            const isSelected = filters.rams.includes(ram)
            return (
              <Chip
                key={ram}
                label={ram}
                onClick={() => handleRamChange(ram)}
                sx={{
                  bgcolor: isSelected ? 'error.main' : '#f5f5f5',
                  color: isSelected ? 'white' : 'text.primary',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  '&:hover': { bgcolor: isSelected ? 'error.dark' : '#e0e0e0' },
                  transition: 'all 0.2s'
                }}
              />
            )
          })}
        </Box>
      </FilterSection>

      {/* Storage */}
      <FilterSection
        title="Bộ Nhớ Trong"
        badge={filters.storages.length}
        defaultOpen={false}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {storageOptions.map((storage) => {
            const isSelected = filters.storages.includes(storage)
            return (
              <Chip
                key={storage}
                label={storage}
                onClick={() => handleStorageChange(storage)}
                sx={{
                  bgcolor: isSelected ? 'error.main' : '#f5f5f5',
                  color: isSelected ? 'white' : 'text.primary',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  '&:hover': { bgcolor: isSelected ? 'error.dark' : '#e0e0e0' },
                  transition: 'all 0.2s'
                }}
              />
            )
          })}
        </Box>
      </FilterSection>

      {/* Rating */}
      <FilterSection
        title="Đánh Giá"
        badge={filters.rating > 0 ? 1 : 0}
        defaultOpen={false}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {[4, 3, 2, 1].map((star) => {
            const isSelected = filters.rating === star
            return (
              <Box
                key={star}
                onClick={() => handleRatingChange(star)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  p: 1,
                  borderRadius: 1,
                  bgcolor: isSelected ? 'rgba(211, 47, 47, 0.1)' : 'transparent',
                  border: isSelected ? '1px solid rgba(211, 47, 47, 0.3)' : '1px solid transparent',
                  '&:hover': { bgcolor: '#f5f5f5' },
                  transition: 'all 0.2s'
                }}
              >
                <Rating value={star} readOnly size="small" sx={{ color: '#FFB400' }} />
                <Typography variant="body2" color="text.secondary">
                  {star === 4 ? 'Tuyệt vời' : star === 3 ? 'Tốt' : star === 2 ? 'Khá' : 'Trung bình'}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  & trở lên
                </Typography>
              </Box>
            )
          })}
        </Box>
      </FilterSection>

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={clearAllFilters}
          startIcon={<CloseIcon />}
          sx={{ mt: 2 }}
        >
          Xóa {activeFilterCount} bộ lọc
        </Button>
      )}
    </Box>
  )
}

// Mobile Filter Drawer
export function MobileFilterDrawer({ open, onClose, filters, setFilters }) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: '85%', maxWidth: 360 }
      }}
    >
      <FilterSidebar
        filters={filters}
        setFilters={setFilters}
        isMobile={true}
        onClose={onClose}
      />
    </Drawer>
  )
}

export default FilterSidebar
