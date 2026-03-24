import { Box, Typography, Chip, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

// Price presets
const pricePresets = [
  { label: 'Dưới 3 triệu', min: 0, max: 3000000 },
  { label: '3 - 5 triệu', min: 3000000, max: 5000000 },
  { label: '5 - 10 triệu', min: 5000000, max: 10000000 },
  { label: '10 - 15 triệu', min: 10000000, max: 15000000 },
  { label: '15 - 20 triệu', min: 15000000, max: 20000000 },
  { label: 'Trên 20 triệu', min: 20000000, max: 999999999 }
]

// Brands
const brands = [
  { id: 'apple', name: 'Apple' },
  { id: 'samsung', name: 'Samsung' },
  { id: 'xiaomi', name: 'Xiaomi' },
  { id: 'oppo', name: 'OPPO' },
  { id: 'vivo', name: 'Vivo' },
  { id: 'realme', name: 'Realme' },
  { id: 'nokia', name: 'Nokia' },
  { id: 'oneplus', name: 'OnePlus' }
]

// Colors
const colors = [
  { id: 'black', name: 'Đen' },
  { id: 'white', name: 'Trắng' },
  { id: 'blue', name: 'Xanh dương' },
  { id: 'red', name: 'Đỏ' },
  { id: 'gold', name: 'Vàng' },
  { id: 'green', name: 'Xanh lá' },
  { id: 'purple', name: 'Tím' },
  { id: 'pink', name: 'Hồng' },
  { id: 'gray', name: 'Xám' }
]

// RAM options
const ramOptions = ['4GB', '6GB', '8GB', '12GB', '16GB']

// Storage options
const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB']

function ActiveFilters({ filters, setFilters }) {
  const { categories, brands: selectedBrands, colors: selectedColors, rams, storages, priceRange, rating } = filters

  // Get labels
  const getBrandLabel = (id) => brands.find(b => b.id === id)?.name || id
  const getColorLabel = (id) => colors.find(c => c.id === id)?.name || id

  const getPriceLabel = () => {
    const preset = pricePresets.find(
      p => p.min === priceRange[0] && p.max === priceRange[1]
    )
    if (preset) return preset.label
    const min = priceRange[0] === 0 ? '0' : `${priceRange[0] / 1000000}M`
    const max = priceRange[1] >= 999999999 ? '20M+' : `${priceRange[1] / 1000000}M`
    return `${min} - ${max}`
  }

  // Remove handlers
  const removeCategory = (id) => {
    setFilters({ ...filters, categories: categories.filter(c => c !== id) })
  }

  const removeBrand = (id) => {
    setFilters({ ...filters, brands: selectedBrands.filter(b => b !== id) })
  }

  const removeColor = (id) => {
    setFilters({ ...filters, colors: selectedColors.filter(c => c !== id) })
  }

  const removeRam = (ram) => {
    setFilters({ ...filters, rams: rams.filter(r => r !== ram) })
  }

  const removeStorage = (storage) => {
    setFilters({ ...filters, storages: storages.filter(s => s !== storage) })
  }

  const removePrice = () => {
    setFilters({ ...filters, priceRange: [0, 999999999] })
  }

  const removeRating = () => {
    setFilters({ ...filters, rating: 0 })
  }

  // Clear all
  const clearAll = () => {
    setFilters({
      search: filters.search,
      categories: [],
      brands: [],
      colors: [],
      rams: [],
      storages: [],
      priceRange: [0, 999999999],
      rating: 0
    })
  }

  // Count active
  const activeCount =
    categories.length +
    selectedBrands.length +
    selectedColors.length +
    rams.length +
    storages.length +
    (priceRange[0] > 0 || priceRange[1] < 999999999 ? 1 : 0) +
    (rating > 0 ? 1 : 0)

  if (activeCount === 0) return null

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        p: 2,
        bgcolor: 'white',
        borderRadius: 2,
        mb: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
        Đang lọc:
      </Typography>

      {/* Categories */}
      {categories.map((id) => (
        <Chip
          key={`cat-${id}`}
          label={`Danh mục: ${id}`}
          size="small"
          onDelete={() => removeCategory(id)}
          sx={{
            bgcolor: 'rgba(211, 47, 47, 0.1)',
            color: 'error.main',
            fontWeight: 'bold',
            border: '1px solid rgba(211, 47, 47, 0.3)',
            '& .MuiChip-deleteIcon': {
              color: 'error.main',
              '&:hover': { color: 'error.dark' }
            }
          }}
        />
      ))}

      {/* Brands */}
      {selectedBrands.map((id) => (
        <Chip
          key={`brand-${id}`}
          label={getBrandLabel(id)}
          size="small"
          onDelete={() => removeBrand(id)}
          sx={{
            bgcolor: 'rgba(25, 118, 210, 0.1)',
            color: 'primary.main',
            fontWeight: 'bold',
            border: '1px solid rgba(25, 118, 210, 0.3)',
            '& .MuiChip-deleteIcon': {
              color: 'primary.main',
              '&:hover': { color: 'primary.dark' }
            }
          }}
        />
      ))}

      {/* Colors */}
      {selectedColors.map((id) => (
        <Chip
          key={`color-${id}`}
          label={getColorLabel(id)}
          size="small"
          onDelete={() => removeColor(id)}
          sx={{
            bgcolor: 'rgba(156, 39, 176, 0.1)',
            color: 'purple.main',
            fontWeight: 'bold',
            border: '1px solid rgba(156, 39, 176, 0.3)',
            '& .MuiChip-deleteIcon': {
              color: 'purple.main',
              '&:hover': { color: 'purple.dark' }
            }
          }}
        />
      ))}

      {/* RAM */}
      {rams.map((ram) => (
        <Chip
          key={`ram-${ram}`}
          label={`RAM ${ram}`}
          size="small"
          onDelete={() => removeRam(ram)}
          sx={{
            bgcolor: 'rgba(0, 150, 136, 0.1)',
            color: 'teal.main',
            fontWeight: 'bold',
            border: '1px solid rgba(0, 150, 136, 0.3)',
            '& .MuiChip-deleteIcon': {
              color: 'teal.main',
              '&:hover': { color: 'teal.dark' }
            }
          }}
        />
      ))}

      {/* Storage */}
      {storages.map((storage) => (
        <Chip
          key={`storage-${storage}`}
          label={`ROM ${storage}`}
          size="small"
          onDelete={() => removeStorage(storage)}
          sx={{
            bgcolor: 'rgba(255, 152, 0, 0.1)',
            color: 'orange.main',
            fontWeight: 'bold',
            border: '1px solid rgba(255, 152, 0, 0.3)',
            '& .MuiChip-deleteIcon': {
              color: 'orange.main',
              '&:hover': { color: 'orange.dark' }
            }
          }}
        />
      ))}

      {/* Price */}
      {(priceRange[0] > 0 || priceRange[1] < 999999999) && (
        <Chip
          label={`Giá: ${getPriceLabel()}`}
          size="small"
          onDelete={removePrice}
          sx={{
            bgcolor: 'rgba(76, 175, 80, 0.1)',
            color: 'success.main',
            fontWeight: 'bold',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            '& .MuiChip-deleteIcon': {
              color: 'success.main',
              '&:hover': { color: 'success.dark' }
            }
          }}
        />
      )}

      {/* Rating */}
      {rating > 0 && (
        <Chip
          label={`⭐ ${rating}+ sao`}
          size="small"
          onDelete={removeRating}
          sx={{
            bgcolor: 'rgba(255, 193, 7, 0.2)',
            color: 'warning.dark',
            fontWeight: 'bold',
            border: '1px solid rgba(255, 193, 7, 0.5)',
            '& .MuiChip-deleteIcon': {
              color: 'warning.dark',
              '&:hover': { color: 'warning.main' }
            }
          }}
        />
      )}

      {/* Clear All Button */}
      <Button
        variant="text"
        size="small"
        onClick={clearAll}
        sx={{
          ml: 'auto',
          color: 'error.main',
          fontWeight: 'bold',
          '&:hover': { textDecoration: 'underline', bgcolor: 'rgba(211, 47, 47, 0.05)' }
        }}
        startIcon={<CloseIcon />}
      >
        Xóa tất cả ({activeCount})
      </Button>
    </Box>
  )
}

export default ActiveFilters
