import { useState, useMemo } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Collapse, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, Switch, Chip, Avatar,
  MenuItem, Select, FormControl, InputLabel, InputAdornment, Tabs, Tab, Tooltip
} from '@mui/material'

// Icons
import SearchIcon from '@mui/icons-material/Search'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import SaveIcon from '@mui/icons-material/Save'
import GroupIcon from '@mui/icons-material/Group'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonIcon from '@mui/icons-material/Person'
import BlockIcon from '@mui/icons-material/Block'

// ==========================================
// 📦 MOCK DATA
// ==========================================
// Giả lập ID của Admin đang đăng nhập (Để test tính năng chống "Tự sát")
const currentAdminId = 'U1'

const mockUsers = [
  { _id: 'U1', name: 'Nguyễn Văn Admin', email: 'admin@phonestore.com', phone: '0901234567', role: 'ADMIN', status: 'ACTIVE', avatar: 'https://i.pravatar.cc/150?u=1', createdAt: '2025-01-10T10:00', orderCount: 15 },
  { _id: 'U2', name: 'Trần Khách Hàng', email: 'khachhang@gmail.com', phone: '0987654321', role: 'USER', status: 'ACTIVE', avatar: 'https://i.pravatar.cc/150?u=2', createdAt: '2026-02-15T14:30', orderCount: 3 },
  { _id: 'U3', name: 'Lê Spam Bom Hàng', email: 'spammer@yahoo.com', phone: '0911222333', role: 'USER', status: 'BLOCKED', avatar: 'https://i.pravatar.cc/150?u=3', createdAt: '2026-02-20T09:15', orderCount: 0 },
]

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN')

function User() {
  const [users, setUsers] = useState(mockUsers)
  const [currentTab, setCurrentTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedRowId, setExpandedRowId] = useState(null)

  // State cho Popup xác nhận thăng cấp Admin
  const [promoteConfirm, setPromoteConfirm] = useState({ isOpen: false, user: null, newRole: '' })

  // ==========================================
  // HÀM XỬ LÝ LỌC & TÌM KIẾM
  // ==========================================
  const filteredUsers = useMemo(() => {
    let result = users

    // 1. Lọc theo Tab
    if (currentTab === 'ADMIN') result = result.filter(u => u.role === 'ADMIN')
    if (currentTab === 'USER') result = result.filter(u => u.role === 'USER')
    if (currentTab === 'BLOCKED') result = result.filter(u => u.status === 'BLOCKED')

    // 2. Lọc theo Text Search (Tên, Email hoặc SĐT)
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      result = result.filter(u =>
        u.name.toLowerCase().includes(lowerQuery) ||
        u.email.toLowerCase().includes(lowerQuery) ||
        u.phone.includes(searchQuery)
      )
    }
    return result
  }, [users, currentTab, searchQuery])

  // ==========================================
  // COMPONENT DÒNG DỮ LIỆU (ROW)
  // ==========================================
  const UserRow = ({ row }) => {
    const isExpanded = expandedRowId === row._id

    // 🌟 BẪY PHÒNG THỦ 1: Kiểm tra xem user này có phải là chính mình không
    const isMe = row._id === currentAdminId

    // State nội bộ cho form Sửa
    const [editData, setEditData] = useState({
      role: row.role,
      status: row.status
    })

    const handleToggleExpand = (id) => setExpandedRowId(expandedRowId === id ? null : id)

    // Bật tắt trạng thái nhanh ngay ngoài bảng
    const handleToggleStatus = (e) => {
      e.stopPropagation()
      if (isMe) return // Không cho tự khóa mình

      const newStatus = row.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'
      // Đáng lẽ sẽ gọi API ở đây, giờ mình update state UI
      setUsers(users.map(u => u._id === row._id ? { ...u, status: newStatus } : u))
    }

    // Xử lý khi chọn đổi Role trong Dropdown
    const handleRoleChange = (e) => {
      const selectedRole = e.target.value
      if (selectedRole === 'ADMIN' && row.role === 'USER') {
        // Nếu đang là User mà đòi lên Admin -> Bật Cảnh Báo
        setPromoteConfirm({ isOpen: true, user: row, newRole: selectedRole })
      } else {
        setEditData({ ...editData, role: selectedRole })
      }
    }

    return (
      <>
        {/* DÒNG HIỂN THỊ CHÍNH */}
        <TableRow hover={true} onClick={() => handleToggleExpand(row._id)} sx={{ cursor: 'pointer', '& > *': { borderBottom: 'unset' }, opacity: row.status === 'BLOCKED' ? 0.6 : 1 }}>
          <TableCell>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleToggleExpand(row._id); }}>
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={row.avatar} alt={row.name} sx={{ width: 40, height: 40 }} />
              <Box>
                <Typography fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {row.name}
                  {/* Nếu là tài khoản của mình thì hiện thêm chữ (Bạn) */}
                  {isMe && <Typography variant="caption" sx={{ color: 'error.main', fontStyle: 'italic' }}>(Bạn)</Typography>}
                </Typography>
                <Typography variant="caption" color="text.secondary">{row.email}</Typography>
              </Box>
            </Box>
          </TableCell>
          <TableCell>{row.phone}</TableCell>
          <TableCell>
            {row.role === 'ADMIN'
              ? <Chip icon={<AdminPanelSettingsIcon />} label="Quản trị" color="error" size="small" sx={{ fontWeight: 'bold' }} />
              : <Chip icon={<PersonIcon />} label="Khách hàng" color="primary" size="small" variant="outlined" />}
          </TableCell>
          <TableCell>{formatDate(row.createdAt)}</TableCell>
          <TableCell align="right">
            {/* Công tắc Khóa/Mở tài khoản */}
            <Tooltip title={isMe ? "Không thể tự khóa tài khoản của mình" : (row.status === 'ACTIVE' ? "Khóa tài khoản" : "Mở khóa")}>
              <span>
                <Switch
                  checked={row.status === 'ACTIVE'}
                  color="success"
                  onChange={handleToggleStatus}
                  disabled={isMe} // 🌟 BẪY PHÒNG THỦ
                />
              </span>
            </Tooltip>
          </TableCell>
        </TableRow>

        {/* KHUNG TRƯỢT XUỐNG ĐỂ CẤP QUYỀN */}
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 3, my: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3 }}>
                  Thiết lập phân quyền: <span style={{ color: '#3b82f6' }}>{row.email}</span>
                </Typography>

                <Grid container spacing={4} alignItems="center">
                  {/* Cột 1: Thông tin mua hàng */}
                  <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                      <Typography variant="caption" color="text.secondary">Thống kê mua hàng</Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        Đã mua {row.orderCount} đơn
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Cột 2: Form đổi quyền */}
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small" disabled={isMe}>
                      <InputLabel>Vai trò hệ thống (Role)</InputLabel>
                      <Select
                        value={editData.role} label="Vai trò hệ thống (Role)"
                        onChange={handleRoleChange}
                      >
                        <MenuItem value="USER">Khách hàng (USER)</MenuItem>
                        <MenuItem value="ADMIN">Quản trị viên (ADMIN)</MenuItem>
                      </Select>
                    </FormControl>
                    {isMe && <Typography variant="caption" color="error.main" sx={{ mt: 1, display: 'block' }}>* Bạn không thể tự thay đổi quyền của chính mình.</Typography>}
                  </Grid>

                  <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                    <Button variant="outlined" color="inherit" onClick={() => setExpandedRowId(null)} sx={{ mr: 2 }}>Đóng</Button>
                    <Button variant="contained" color="primary" startIcon={<SaveIcon />} disabled={isMe}>Lưu Phân Quyền</Button>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    )
  }

  return (
    <Box sx={{ pb: 5 }}>
      {/* HEADER & THANH TÌM KIẾM */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupIcon color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight="bold" color="#1e293b">Quản lý Khách Hàng</Typography>
        </Box>

        <TextField
          placeholder="Tìm tên, email, sđt..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: '100%', md: '300px' }, bgcolor: '#fff', borderRadius: 1 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
          }}
        />
      </Box>

      {/* THANH TABS LỌC TRẠNG THÁI */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, bgcolor: '#fff', borderRadius: 2, px: 2 }}>
        <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)} textColor="primary" indicatorColor="primary">
          <Tab label="Tất cả" value="ALL" sx={{ fontWeight: 'bold' }} />
          <Tab icon={<AdminPanelSettingsIcon fontSize="small" />} iconPosition="start" label="Quản trị viên" value="ADMIN" sx={{ fontWeight: 'bold' }} />
          <Tab icon={<PersonIcon fontSize="small" />} iconPosition="start" label="Khách hàng" value="USER" sx={{ fontWeight: 'bold' }} />
          <Tab icon={<BlockIcon fontSize="small" />} iconPosition="start" label="Bị khóa" value="BLOCKED" sx={{ fontWeight: 'bold', color: 'error.main' }} />
        </Tabs>
      </Box>

      {/* BẢNG DANH SÁCH */}
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow hover={true}>
              <TableCell width="50px" />
              <TableCell sx={{ fontWeight: 'bold' }}>Khách Hàng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Điện Thoại</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phân Quyền</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày Tham Gia</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Trạng Thái (Active)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((row) => <UserRow key={row._id} row={row} />)
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">Không tìm thấy khách hàng nào.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ========================================== */}
      {/* 🌟 BẪY PHÒNG THỦ 2: POPUP CẢNH BÁO THĂNG CẤP */}
      {/* ========================================== */}
      <Dialog open={promoteConfirm.isOpen} onClose={() => setPromoteConfirm({ isOpen: false, user: null, newRole: '' })} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AdminPanelSettingsIcon /> Cảnh báo bảo mật
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Bạn đang chuẩn bị cấp quyền <b>Quản trị viên (ADMIN)</b> cho tài khoản:
          </Typography>
          <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Typography fontWeight="bold" color="primary">{promoteConfirm.user?.name}</Typography>
            <Typography variant="body2" color="text.secondary">{promoteConfirm.user?.email}</Typography>
          </Box>
          <Typography variant="body2" color="error.main" sx={{ mt: 2, fontStyle: 'italic' }}>
            * Lưu ý: Người này sẽ có toàn quyền xem doanh thu, sửa sản phẩm và quản lý hệ thống. Bạn có chắc chắn không?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPromoteConfirm({ isOpen: false, user: null, newRole: '' })} color="inherit">Hủy bỏ</Button>
          <Button variant="contained" color="error">Xác nhận Thăng Cấp</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default User