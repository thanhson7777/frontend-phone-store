import { AppBar, Toolbar, Box } from '@mui/material'
import Logo from './Logo'
import SearchBar from './SearchBar'
import CartIcon from './CartIcon'
import AuthButtons from './AuthButtons'

function Header() {
  return (
    <AppBar position="sticky" sx={{ bgcolor: 'error.main' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

        {/*Logo */}
        <Logo />

        {/*Thanh tìm kiếm */}
        <SearchBar />

        {/* Khung chứa các mảnh ghép bên phải */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Mảnh ghép 3: Giỏ hàng */}
          <CartIcon />

          {/* Mảnh ghép 4: Nút đăng nhập/đăng ký */}
          <AuthButtons />
        </Box>

      </Toolbar>
    </AppBar>
  )
}

export default Header