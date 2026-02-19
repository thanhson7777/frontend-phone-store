import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
  IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Menu, MenuItem, Tooltip, Button
} from '@mui/material'

// Import Icons
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SmartphoneIcon from '@mui/icons-material/Smartphone'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import PeopleIcon from '@mui/icons-material/People'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

const drawerWidth = 260

// 📌 Cấu hình Menu Sidebar
const MENU_ITEMS = [
  { text: 'Tổng quan', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Sản phẩm', icon: <SmartphoneIcon />, path: '/admin/products' },
  { text: 'Đơn hàng', icon: <ReceiptLongIcon />, path: '/admin/orders' },
  { text: 'Mã giảm giá', icon: <CardGiftcardIcon />, path: '/admin/coupons' },
  { text: 'Khách hàng', icon: <PeopleIcon />, path: '/admin/users' }
]

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  // State đóng mở Sidebar trên điện thoại
  const [mobileOpen, setMobileOpen] = useState(false)

  // State cho Menu Avatar góc phải
  const [anchorEl, setAnchorEl] = useState(null)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const handleLogout = () => {
    // 🌟 Chỗ này fen gọi hàm dispatch(logout) của Redux nhé
    console.log('Đăng xuất Admin...')
    navigate('/login')
  }

  // 📦 Component chứa nội dung của Sidebar (Dùng chung cho cả Mobile và Desktop)
  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', bgcolor: '#1e1e2f', color: '#fff' }}>
        <Typography variant="h6" fontWeight="bold" noWrap>
          PHONE STORE
        </Typography>
      </Toolbar>
      <Divider />

      <List sx={{ flexGrow: 1, bgcolor: '#27293d', color: '#b2b2bf', pt: 2 }}>
        {MENU_ITEMS.map((item) => {
          // Kiểm tra xem URL hiện tại có khớp với path của menu không để tô màu (Active state)
          const isActive = location.pathname === item.path ||
            (item.path !== '/admin' && location.pathname.startsWith(item.path))

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path)
                  setMobileOpen(false) // Bấm xong tự đóng menu trên mobile
                }}
                sx={{
                  mx: 2, borderRadius: 2,
                  bgcolor: isActive ? '#e11d48' : 'transparent', // Màu đỏ khi đang chọn
                  color: isActive ? '#fff' : 'inherit',
                  '&:hover': { bgcolor: isActive ? '#e11d48' : 'rgba(255,255,255,0.08)' }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#fff' : 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'medium' }} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ p: 2, bgcolor: '#27293d' }}>
        <Button
          fullWidth variant="contained" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f5f7' }}>

      {/* 1️⃣ TOPBAR (HEADER) */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#fff',
          color: '#333'
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {/* Tự động đổi tên Header theo Menu đang chọn */}
            {MENU_ITEMS.find(i => location.pathname === i.path || (i.path !== '/admin' && location.pathname.startsWith(i.path)))?.text || 'Quản trị'}
          </Typography>

          {/* Avatar Admin góc phải */}
          <Tooltip title="Tài khoản">
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: 'error.main' }}>AD</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleMenuClose}><AccountCircleIcon sx={{ mr: 1, color: 'text.secondary' }} /> Hồ sơ</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}><LogoutIcon sx={{ mr: 1 }} /> Đăng xuất</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* 2️⃣ SIDEBAR (DRAWER) */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Drawer trên Mobile (Vuốt để mở) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Tối ưu hiệu năng trên mobile
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' } }}
        >
          {drawerContent}
        </Drawer>

        {/* Drawer trên Desktop (Cố định) */}
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' } }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* 3️⃣ MAIN CONTENT (Khu vực nhúng các Component con) */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}>

        {/* Nơi xuất hiện của Dashboard, Products, Orders... */}
        <Outlet />

      </Box>
    </Box>
  )
}

export default AdminLayout