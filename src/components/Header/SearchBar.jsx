import { Paper, InputBase, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

function SearchBar() {
  return (
    <Paper
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: { xs: '100%', sm: 300, md: 400 },
        borderRadius: 2,
        mx: 2
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Tìm kiếm..."
      />
      <IconButton type="button" sx={{ p: '10px', color: 'error.main' }}>
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}

export default SearchBar