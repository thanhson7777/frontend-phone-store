import { useState, useEffect } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Tabs, Tab, Select, MenuItem,
  IconButton, Collapse, Grid, Avatar, CircularProgress, Switch,
  TextField, InputAdornment, Button, Chip, Pagination
} from '@mui/material'

import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonIcon from '@mui/icons-material/Person'
import BlockIcon from '@mui/icons-material/Block'
import { toast } from 'react-toastify'

// Import API
import {
  fetchAdminUsersAPI,
  updateAdminUserRoleAPI
} from '~/apis'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

// Hàm format ngày tháng
const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

function User() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState('ALL')
  const [expandedRowId, setExpandedRowId] = useState(null)

  // State Phân trang & Tìm kiếm
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const currentUser = useSelector(selectCurrentUser)

  const currentUserId = currentUser?._id

  // ==========================================
  // 1. LẤY DỮ LIỆU USER TỪ BACKEND
  // ==========================================
  const loadUsers = async () => {
    try {
      setLoading(true)
      const params = { page: page, limit: 10 }

      // Xử lý logic Tab lọc
      if (currentTab === 'ADMIN') params.role = 'ADMIN'
      if (currentTab === 'CLIENT') params.role = 'CLIENT'
      if (currentTab === 'BLOCKED') params.isActive = 'false'

      // Nếu có search thì gửi keyword lên (Backend cần support tìm kiếm keyword)
      if (searchQuery) params.keyword = searchQuery

      const res = await fetchAdminUsersAPI(params)
      if (res && res.data) {
        setUsers(res.data.users || [])
        setTotalPages(res.data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Lỗi lấy user:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [page, currentTab])

  // Xử lý Search (Bấm Enter mới tìm để đỡ gọi API liên tục)
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(1)
      loadUsers()
    }
  }

  // ==========================================
  // 2. COMPONENT DÒNG DỮ LIỆU
  // ==========================================
  const UserRow = ({ row }) => {
    const isExpanded = expandedRowId === row._id
    const isCurrentUser = row._id === currentUserId // 🌟 LOGIC QUAN TRỌNG: Kiểm tra xem có phải chính mình không

    const [editRole, setEditRole] = useState(row.role || 'CLIENT')

    // API: Bật/Tắt tài khoản
    const handleToggleStatus = async (e) => {
      e.stopPropagation()
      if (isCurrentUser) return toast.warning('Bạn không thể tự khóa tài khoản của mình!')

      try {
        const newStatus = e.target.checked
        await updateAdminUserRoleAPI(row._id, { isActive: newStatus })
        toast.success(newStatus ? 'Đã mở khóa tài khoản!' : 'Đã khóa tài khoản!')
        loadUsers()
      } catch (error) { toast.error("Không thể đổi trạng thái") }
    }

    // API: Lưu thay đổi Quyền
    const handleSaveRole = async () => {
      if (isCurrentUser) return toast.warning('Bạn không thể tự đổi quyền của mình!')
      if (editRole === row.role) return setExpandedRowId(null)

      try {
        await toast.promise(
          updateAdminUserRoleAPI(row._id, { role: editRole }),
          { pending: 'Đang cập nhật...', success: 'Cập nhật phân quyền thành công!', error: 'Lỗi!' }
        )
        setExpandedRowId(null)
        loadUsers()
      } catch (error) { console.error(error) }
    }

    return (
      <>
        {/* DÒNG HIỂN THỊ CHÍNH */}
        <TableRow hover sx={{ cursor: 'pointer', '& > *': { borderBottom: 'unset', bgcolor: isCurrentUser ? '#fff1f2' : 'inherit' } }} onClick={() => setExpandedRowId(isExpanded ? null : row._id)}>
          <TableCell width="40px"><IconButton size="small"><KeyboardArrowDownIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} /></IconButton></TableCell>

          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={row.avatar} alt={row.displayName} />
              <Box>
                <Typography fontWeight="bold" fontSize="14px">
                  {row.displayName || row.username}
                  {isCurrentUser && <span style={{ color: '#ef4444', fontStyle: 'italic', fontWeight: 'normal', marginLeft: '6px' }}>(Bạn)</span>}
                </Typography>
                <Typography fontSize="13px" color="text.secondary">{row.email}</Typography>
              </Box>
            </Box>
          </TableCell>

          <TableCell>
            <Chip
              icon={row.role === 'ADMIN' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
              label={row.role === 'ADMIN' ? 'Quản trị' : 'Khách hàng'}
              color={row.role === 'ADMIN' ? 'error' : 'default'}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </TableCell>

          <TableCell>{formatDate(row.createdAt)}</TableCell>

          <TableCell onClick={(e) => e.stopPropagation()}>
            <Switch color="success" checked={row.isActive !== false} onChange={handleToggleStatus} disabled={isCurrentUser} />
          </TableCell>
        </TableRow>

        {/* THANH TRƯỢT SỬA PHÂN QUYỀN */}
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 3, my: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Thiết lập phân quyền: <span style={{ color: '#2563eb' }}>{row.email}</span>
                </Typography>

                <Grid container spacing={4} alignItems="center">
                  {/* Cột Thống kê (Giả lập) */}
                  <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#fff' }}>
                      <Typography variant="body2" color="text.secondary" mb={1}>Thống kê mua hàng</Typography>
                      <Typography variant="h6" fontWeight="bold" color="error.main">Đã mua {row.orderCount || 0} đơn</Typography>
                    </Box>
                  </Grid>

                  {/* Cột Form Đổi Quyền */}
                  <Grid item xs={12} md={5}>
                    <Typography variant="body2" color="text.secondary" mb={1}>Vai trò hệ thống (Role)</Typography>
                    <Select fullWidth size="small" value={editRole} onChange={(e) => setEditRole(e.target.value)} disabled={isCurrentUser}>
                      <MenuItem value="ADMIN">Quản trị viên (ADMIN)</MenuItem>
                      <MenuItem value="CLIENT">Khách hàng (CLIENT)</MenuItem>
                    </Select>
                    {isCurrentUser && (
                      <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 1 }}>
                        * Bạn không thể tự thay đổi quyền của chính mình.
                      </Typography>
                    )}
                  </Grid>

                  {/* Cột Nút bấm */}
                  <Grid item xs={12} md={3} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: { xs: 2, md: 0 } }}>
                    <Button variant="outlined" color="inherit" onClick={() => setExpandedRowId(null)}>Đóng</Button>
                    <Button variant="contained" color="error" disabled={isCurrentUser || editRole === row.role} onClick={handleSaveRole}>Lưu Phân Quyền</Button>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    )
  }

  if (loading && users.length === 0) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 10 }} />

  return (
    <Box sx={{ pb: 5 }}>
      {/* HEADER & SEARCH BAR */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleAltIcon color="error" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">Quản lý Khách Hàng</Typography>
        </Box>
        <TextField
          placeholder="Tìm tên, email..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
          sx={{ width: '300px', bgcolor: '#fff', borderRadius: 1 }}
        />
      </Box>

      {/* THANH TABS */}
      <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newVal) => { setCurrentTab(newVal); setPage(1); }}
          textColor="error" indicatorColor="error" variant="scrollable"
        >
          <Tab label="TẤT CẢ" value="ALL" sx={{ fontWeight: 'bold' }} />
          <Tab icon={<AdminPanelSettingsIcon fontSize="small" />} iconPosition="start" label="QUẢN TRỊ VIÊN" value="ADMIN" sx={{ fontWeight: 'bold' }} />
          <Tab icon={<PersonIcon fontSize="small" />} iconPosition="start" label="KHÁCH HÀNG" value="USER" sx={{ fontWeight: 'bold' }} />
          <Tab icon={<BlockIcon fontSize="small" />} iconPosition="start" label="BỊ KHÓA" value="BLOCKED" sx={{ fontWeight: 'bold' }} />
        </Tabs>
      </Paper>

      {/* BẢNG DỮ LIỆU */}
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell width="40px" />
              <TableCell sx={{ fontWeight: 'bold' }}>Khách Hàng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phân Quyền</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày Tham Gia</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng Thái (Active)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((row) => <UserRow key={row._id} row={row} />)
            ) : (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>Không tìm thấy dữ liệu!</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PHÂN TRANG */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={totalPages} page={page} onChange={(e, val) => setPage(val)} color="error" size="large" />
        </Box>
      )}
    </Box>
  )
}

export default User