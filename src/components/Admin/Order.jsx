import { useState, useMemo } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Tabs, Tab, Drawer, IconButton,
  Divider, Grid, MenuItem, Select, FormControl, InputLabel
} from '@mui/material'

// Icons
import CloseIcon from '@mui/icons-material/Close'
import PrintIcon from '@mui/icons-material/Print'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'

// ==========================================
// 📦 MOCK DATA & CẤU HÌNH TRẠNG THÁI
// ==========================================
const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Chờ xác nhận', color: 'warning', level: 1 },
  { value: 'SHIPPING', label: 'Đang giao', color: 'info', level: 2 },
  { value: 'DELIVERED', label: 'Đã giao', color: 'success', level: 3 },
  { value: 'CANCELLED', label: 'Đã huỷ', color: 'error', level: 99 } // Hủy là trạng thái rẽ nhánh
]

const mockOrders = [
  {
    _id: '64a1b2c3d4e5f6001ORD1234',
    customerName: 'Nguyễn Văn A', phone: '0901234567', address: '123 Lê Lợi, Q1, TP.HCM', note: 'Giao giờ hành chính',
    totalPrice: 29000000, status: 'PENDING', createdAt: 1770978068879,
    products: [
      { name: 'iPhone 15 Pro Max', sku: 'IP15PM-256-TITAN', price: 29000000, quantity: 1, image: 'https://via.placeholder.com/60' }
    ]
  },
  {
    _id: '64a1b2c3d4e5f6001ORD5678',
    customerName: 'Trần Thị B', phone: '0987654321', address: '456 Hai Bà Trưng, HN', note: '',
    totalPrice: 15500000, status: 'SHIPPING', createdAt: 1770878068879,
    products: [
      { name: 'Samsung S24', sku: 'SS24-256-DEN', price: 15500000, quantity: 1, image: 'https://via.placeholder.com/60' }
    ]
  }
]

// Hàm tiện ích
const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
const formatDate = (timestamp) => new Date(timestamp).toLocaleString('vi-VN')

function Order() {
  const [orders, setOrders] = useState(mockOrders)
  const [currentTab, setCurrentTab] = useState('ALL')

  // State quản lý Drawer (Khung trượt chi tiết)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // State quản lý Dropdown thay đổi trạng thái trong Drawer
  const [newStatus, setNewStatus] = useState('')

  // ==========================================
  // HÀM XỬ LÝ SỰ KIỆN
  // ==========================================
  const handleOpenDrawer = (order) => {
    setSelectedOrder(order)
    setNewStatus(order.status) // Gán trạng thái hiện tại vào Dropdown
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => setSelectedOrder(null), 300) // Đợi Drawer trượt xong mới xóa data
  }

  const handleUpdateStatus = () => {
    // Cập nhật lại list đơn hàng ở ngoài
    setOrders(orders.map(o => o._id === selectedOrder._id ? { ...o, status: newStatus } : o))
    // Cập nhật data đang xem trong Drawer
    setSelectedOrder({ ...selectedOrder, status: newStatus })
    // toast.success('Cập nhật trạng thái thành công!')
  }

  const handlePrint = () => {
    // Kích hoạt hộp thoại in mặc định của trình duyệt
    window.print()
  }

  // Lọc đơn hàng theo Tab
  const filteredOrders = useMemo(() => {
    if (currentTab === 'ALL') return orders
    return orders.filter(o => o.status === currentTab)
  }, [orders, currentTab])

  // 🌟 LOGIC "TRẠNG THÁI MỘT CHIỀU" (Tiến lên không lùi bước)
  const getAvailableStatuses = (currentStatusValue) => {
    const currentStatus = ORDER_STATUSES.find(s => s.value === currentStatusValue)

    // Nếu đã Giao hoặc Đã Hủy thì khóa luôn, không cho đổi nữa
    if (currentStatusValue === 'DELIVERED' || currentStatusValue === 'CANCELLED') {
      return [currentStatus]
    }

    // Chỉ lấy những trạng thái có level lớn hơn hoặc bằng level hiện tại, và trạng thái Hủy
    return ORDER_STATUSES.filter(s => s.level >= currentStatus.level || s.value === 'CANCELLED')
  }

  return (
    <Box sx={{ pb: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
        <LocalShippingIcon color="error" fontSize="large" />
        <Typography variant="h5" fontWeight="bold">Quản lý Đơn hàng</Typography>
      </Box>

      {/* 1. THANH TABS LỌC TRẠNG THÁI */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, bgcolor: '#fff', borderRadius: 2, px: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          textColor="error" indicatorColor="error"
        >
          <Tab label="Tất cả" value="ALL" sx={{ fontWeight: 'bold' }} />
          {ORDER_STATUSES.map(tab => (
            <Tab key={tab.value} label={tab.label} value={tab.value} sx={{ fontWeight: 'bold' }} />
          ))}
        </Tabs>
      </Box>

      {/* 2. BẢNG DANH SÁCH ĐƠN HÀNG */}
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table hover>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Mã Đơn</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Khách Hàng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày Đặt</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tổng Tiền</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng Thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((row) => {
              const statusObj = ORDER_STATUSES.find(s => s.value === row.status)
              return (
                <TableRow
                  key={row._id}
                  hover
                  onClick={() => handleOpenDrawer(row)} // Click vào dòng sẽ mở Drawer
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>
                    #{row._id.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">{row.customerName}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.phone}</Typography>
                  </TableCell>
                  <TableCell>{formatDate(row.createdAt)}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'error.main' }}>
                    {formatPrice(row.totalPrice)}
                  </TableCell>
                  <TableCell>
                    <Chip label={statusObj?.label} color={statusObj?.color} size="small" sx={{ fontWeight: 'bold' }} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ========================================== */}
      {/* 3. KHUNG TRƯỢT CHI TIẾT ĐƠN HÀNG (DRAWER) */}
      {/* ========================================== */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{ sx: { width: { xs: '100%', md: '450px' }, p: 0, bgcolor: '#f8fafc' } }}
      >
        {selectedOrder && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* DRAWER HEADER */}
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="h6" fontWeight="bold">
                Chi tiết Đơn #{selectedOrder._id.slice(-8).toUpperCase()}
              </Typography>
              <Box>
                <IconButton onClick={handlePrint} color="primary" title="In hóa đơn">
                  <PrintIcon />
                </IconButton>
                <IconButton onClick={handleCloseDrawer}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            {/* DRAWER BODY (Scrollable) */}
            <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>

              {/* Khối 1: Thông tin người nhận */}
              <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>THÔNG TIN NHẬN HÀNG</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedOrder.customerName} - {selectedOrder.phone}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{selectedOrder.address}</Typography>
                {selectedOrder.note && (
                  <Typography variant="body2" color="error.main" sx={{ mt: 1, fontStyle: 'italic' }}>
                    * Ghi chú: {selectedOrder.note}
                  </Typography>
                )}
              </Paper>

              {/* Khối 2: Danh sách Sản phẩm */}
              <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>SẢN PHẨM</Typography>
                {selectedOrder.products.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 2, pb: 2, borderBottom: '1px dashed #e2e8f0' }}>
                    <Box component="img" src={item.image} sx={{ width: 60, height: 60, objectFit: 'contain', border: '1px solid #eee', borderRadius: 1 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">Phân loại: {item.sku}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2" fontWeight="bold">x{item.quantity}</Typography>
                        <Typography variant="body2" color="error.main" fontWeight="bold">{formatPrice(item.price)}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}

                {/* Tổng kết tiền */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="body1" fontWeight="bold">Tổng cộng:</Typography>
                  <Typography variant="h6" color="error.main" fontWeight="bold">{formatPrice(selectedOrder.totalPrice)}</Typography>
                </Box>
              </Paper>
            </Box>

            {/* DRAWER FOOTER (Sticky điều khiển trạng thái) */}
            <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái đơn hàng</InputLabel>
                <Select
                  value={newStatus}
                  label="Trạng thái đơn hàng"
                  onChange={(e) => setNewStatus(e.target.value)}
                  // Vô hiệu hóa Select nếu đơn đã Giao hoặc Đã Hủy
                  disabled={selectedOrder.status === 'DELIVERED' || selectedOrder.status === 'CANCELLED'}
                >
                  {/* Gọi hàm getAvailableStatuses để lọc ra các lựa chọn được phép */}
                  {getAvailableStatuses(selectedOrder.status).map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      <Chip label={status.label} color={status.color} size="small" />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="error"
                size="large"
                fullWidth
                onClick={handleUpdateStatus}
                disabled={newStatus === selectedOrder.status || selectedOrder.status === 'DELIVERED' || selectedOrder.status === 'CANCELLED'}
              >
                Cập nhật trạng thái
              </Button>
            </Box>

          </Box>
        )}
      </Drawer>
    </Box>
  )
}

export default Order