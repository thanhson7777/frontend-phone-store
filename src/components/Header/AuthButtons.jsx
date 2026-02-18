import { useState } from 'react'
import { Box, Button, IconButton, Avatar, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, logoutUserAPI } from '~/redux/user/userSlice'
import Logout from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import Settings from '@mui/icons-material/Settings'
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor'
import { useConfirm } from 'material-ui-confirm'

function AuthButtons() {
  const dispatch = useDispatch()
  // 1. Lấy thông tin user từ kho Redux
  const currentUser = useSelector(selectCurrentUser)

  // State để quản lý đóng/mở Menu Profile
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const confirmLogout = useConfirm()
  const handleLogout = () => {
    confirmLogout({
      title: 'Bạn có muốn đăng xuất?',
      confirmationText: 'Đồng ý',
      cancellationText: 'Hủy'
    }).then(() => {
      dispatch(logoutUserAPI())
    }).catch(() => { })
  }

  // 2. Nếu đã đăng nhập: Hiện Icon Profile
  if (currentUser) {
    return (
      <Box sx={{ ml: 2 }}>
        <IconButton onClick={handleClick} size="small" sx={{ p: 0 }}>
          <Avatar
            src={currentUser?.avatar}
            alt={currentUser?.name}
            sx={{ width: 35, height: 35, border: '2px solid white' }}
          >
            {/* Nếu không có ảnh thì lấy chữ cái đầu tên user */}
            {!currentUser?.avatar && currentUser?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem component={Link} to="/profile">
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            Trang cá nhân
          </MenuItem>
          <MenuItem component={Link} to="/order-history">
            <ListItemIcon><YoutubeSearchedForIcon fontSize="small" /></ListItemIcon>
            Lịch sử đơn hàng
          </MenuItem>
          <MenuItem>
            <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
            Cài đặt
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
            Đăng xuất
          </MenuItem>
        </Menu>
      </Box>
    )
  }

  // 3. Nếu chưa đăng nhập: Hiện nút Đăng Nhập / Đăng Ký
  return (
    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 2 }}>
      <Button
        component={Link}
        to="/login"
        variant="outlined"
        sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: '#f5f5f5' } }}
      >
        Đăng Nhập
      </Button>
      <Button
        component={Link}
        to="/register"
        variant="contained"
        sx={{ bgcolor: 'white', color: 'error.main', '&:hover': { bgcolor: '#f5f5f5' } }}
      >
        Đăng Ký
      </Button>
    </Box>
  )
}

export default AuthButtons