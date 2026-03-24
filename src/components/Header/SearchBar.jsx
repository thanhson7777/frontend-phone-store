import { useState, useEffect, useRef } from 'react'
import {
  Paper, InputBase, IconButton, Box, Typography, List,
  ListItem, ListItemText, Divider, ClickAwayListener
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import HistoryIcon from '@mui/icons-material/History'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate, useLocation } from 'react-router-dom'
import { getProductsAPI } from '~/apis'

// Popular searches
const popularSearches = [
  'iPhone 15',
  'Samsung Galaxy S24',
  'Xiaomi 14',
  'OPPO Find X7',
  'iPhone 14 Pro'
]

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Load search history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    setSearchHistory(history)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Clear search when navigating to different page
  useEffect(() => {
    if (location.pathname !== '/products') {
      setSearchTerm('')
      setShowDropdown(false)
    }
  }, [location.pathname])

  // Fetch suggestions
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      setLoading(true)
      try {
        const res = await getProductsAPI({ name: searchTerm, itemsPerPage: 5 })
        const products = res.products || []
        setSuggestions(products)
      } catch (error) {
        console.log('Lỗi tìm kiếm gợi ý:', error)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Save to search history
  const saveToHistory = (term) => {
    if (!term.trim()) return
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    const filtered = history.filter(item => item.toLowerCase() !== term.toLowerCase())
    const newHistory = [term, ...filtered].slice(0, 5)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
    setSearchHistory(newHistory)
  }

  // Handle search
  const handleSearch = (term) => {
    const searchValue = term || searchTerm
    if (searchValue.trim()) {
      saveToHistory(searchValue.trim())
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`)
      setSearchTerm('')
      setShowDropdown(false)
      inputRef.current?.blur()
    }
  }

  // Handle clear history
  const clearHistory = () => {
    localStorage.removeItem('searchHistory')
    setSearchHistory([])
  }

  // Handle input change
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
    setShowDropdown(true)
    setShowHistory(e.target.value.length === 0)
  }

  // Handle focus
  const handleFocus = () => {
    setShowDropdown(true)
    setShowHistory(searchTerm.length === 0)
  }

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const hasResults = suggestions.length > 0 || searchHistory.length > 0 || searchTerm.length >= 2

  return (
    <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
      <Box
        ref={dropdownRef}
        sx={{
          position: 'relative',
          width: { xs: '100%', sm: 300, md: 400 },
          mx: 2
        }}
      >
        <Paper
          component="form"
          onSubmit={(e) => {
            e.preventDefault()
            handleSearch()
          }}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 2,
            boxShadow: showDropdown ? '0 4px 20px rgba(0,0,0,0.15)' : 1,
            transition: 'box-shadow 0.2s ease'
          }}
        >
          <InputBase
            ref={inputRef}
            sx={{ ml: 1, flex: 1 }}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyPress={handleKeyPress}
          />

          {/* Clear button */}
          {searchTerm && (
            <IconButton
              size="small"
              onClick={() => {
                setSearchTerm('')
                setSuggestions([])
                inputRef.current?.focus()
              }}
              sx={{ p: '5px' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}

          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

          <IconButton
            type="submit"
            sx={{ p: '10px', color: 'error.main' }}
          >
            <SearchIcon />
          </IconButton>
        </Paper>

        {/* Dropdown */}
        {showDropdown && hasResults && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              zIndex: 1000,
              maxHeight: 400,
              overflow: 'auto',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
            }}
          >
            {/* Search History */}
            {showHistory && searchHistory.length > 0 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 2,
                    py: 1
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HistoryIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      Lịch sử tìm kiếm
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color="error.main"
                    sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    onClick={clearHistory}
                  >
                    Xóa
                  </Typography>
                </Box>
                <List dense disablePadding>
                  {searchHistory.map((term, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => handleSearch(term)}
                      sx={{
                        '&:hover': { bgcolor: '#f5f5f5' },
                        py: 0.5
                      }}
                    >
                      <HistoryIcon fontSize="small" color="disabled" sx={{ mr: 1.5 }} />
                      <ListItemText
                        primary={term}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider />
              </Box>
            )}

            {/* Popular Searches */}
            {showHistory && (
              <Box sx={{ px: 2, py: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TrendingUpIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">
                    Tìm kiếm phổ biến
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {popularSearches.map((term) => (
                    <Box
                      key={term}
                      onClick={() => handleSearch(term)}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        bgcolor: '#f5f5f5',
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'error.light',
                          color: 'white'
                        },
                        transition: 'all 0.2s'
                      }}
                    >
                      {term}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Product Suggestions */}
            {suggestions.length > 0 && (
              <Box>
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ px: 2, py: 1, display: 'block', fontWeight: 'bold' }}
                >
                  Sản phẩm gợi ý
                </Typography>
                <List dense disablePadding>
                  {suggestions.map((product) => (
                    <ListItem
                      key={product._id}
                      button
                      onClick={() => {
                        setSearchTerm(product.name)
                        handleSearch(product.name)
                      }}
                      sx={{
                        '&:hover': { bgcolor: '#f5f5f5' },
                        py: 1
                      }}
                    >
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.name}
                        sx={{
                          width: 40,
                          height: 40,
                          objectFit: 'contain',
                          mr: 1.5,
                          borderRadius: 1,
                          bgcolor: '#f5f5f5'
                        }}
                      />
                      <ListItemText
                        primary={product.name}
                        secondary={new Intl.NumberFormat('vi-VN').format(product.basePrice) + 'đ'}
                        primaryTypographyProps={{
                          variant: 'body2',
                          noWrap: true
                        }}
                        secondaryTypographyProps={{
                          variant: 'caption',
                          color: 'error.main',
                          fontWeight: 'bold'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Loading */}
            {loading && searchTerm.length >= 2 && (
              <Box sx={{ px: 2, py: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Đang tìm...
                </Typography>
              </Box>
            )}

            {/* No results */}
            {!loading && searchTerm.length >= 2 && suggestions.length === 0 && !showHistory && (
              <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Không tìm thấy sản phẩm nào
                </Typography>
              </Box>
            )}

            {/* View all results */}
            {(suggestions.length > 0 || (searchTerm && !loading)) && (
              <>
                <Divider />
                <Box
                  onClick={() => handleSearch()}
                  sx={{
                    px: 2,
                    py: 1.5,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f5f5f5' },
                    color: 'error.main',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}
                >
                  Xem tất cả kết quả cho "{searchTerm}"
                </Box>
              </>
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  )
}

export default SearchBar
