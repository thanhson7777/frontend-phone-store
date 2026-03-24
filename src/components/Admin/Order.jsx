import { useState, useEffect } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Tabs, Tab, Select, MenuItem,
  IconButton, Collapse, Avatar, CircularProgress, Pagination
} from '@mui/material'

import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { toast } from 'react-toastify'

// 🌟 Import API
import {
  fetchAdminOrdersAPI,
  updateAdminOrderStatusAPI
} from '~/apis'

// Hàm format tiền và thời gian
const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
const formatDate = (timestamp) => {
  const d = new Date(timestamp)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

// 🌟 CẤU HÌNH TRẠNG THÁI (Màu sắc, Nhãn, và Thứ tự cấp bậc để khóa chiều lùi)
const STATUS_CONFIG = {
  PENDING: { label: 'Chờ xác nhận', color: '#d97706', bg: '#fef3c7', level: 1 },
  CONFIRMED: { label: 'Đã xác nhận', color: '#2563eb', bg: '#dbeafe', level: 2 },
  SHIPPING: { label: 'Đang giao', color: '#0284c7', bg: '#e0f2fe', level: 3 },
  DELIVERED: { label: 'Đã giao', color: '#16a34a', bg: '#dcfce7', level: 4 },
  CANCELLED: { label: 'Đã hủy', color: '#dc2626', bg: '#fee2e2', level: 99 } // Bị hủy là chốt sổ
}

function Order() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState('ALL')
  const [expandedRowId, setExpandedRowId] = useState(null)

  // 🌟 STATE PHÂN TRANG
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // 1. LẤY DỮ LIỆU ĐƠN HÀNG
  const loadOrders = async () => {
    try {
      setLoading(true)

      // Chuẩn bị giỏ hàng tham số
      const params = { page: page, limit: 10 }
      if (currentTab !== 'ALL') {
        params.status = currentTab // Nếu không phải ALL thì kẹp status vào gửi lên
      }

      // Gọi API với params
      const res = await fetchAdminOrdersAPI(params)

      // Hút data orders và số trang từ backend
      if (res && res.data) {
        setOrders(res.data.orders || [])
        setTotalPages(res.data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Lỗi lấy đơn hàng:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [page, currentTab])

  // ==========================================
  // COMPONENT: DÒNG ĐƠN HÀNG & LOGIC CHUYỂN TRẠNG THÁI
  // ==========================================
  const OrderRow = ({ row }) => {
    const isExpanded = expandedRowId === row._id
    const currentStatusInfo = STATUS_CONFIG[row.status]

    // Hàm đổi trạng thái
    const handleStatusChange = async (event) => {
      const newStatus = event.target.value
      if (newStatus === row.status) return

      try {
        await toast.promise(
          updateAdminOrderStatusAPI(row._id, newStatus),
          { pending: 'Đang cập nhật...', success: 'Đổi trạng thái thành công!', error: 'Lỗi cập nhật!' }
        )
        loadOrders() // Load lại bảng để cập nhật màu sắc lập tức
      } catch (error) { console.error(error) }
    }

    return (
      <>
        <TableRow hover sx={{ cursor: 'pointer', '& > *': { borderBottom: 'unset' } }} onClick={() => setExpandedRowId(isExpanded ? null : row._id)}>
          {/* Mũi tên trượt */}
          <TableCell width="40px">
            <IconButton size="small"><KeyboardArrowDownIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} /></IconButton>
          </TableCell>

          {/* Mã Đơn */}
          <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>#{row._id.slice(-8).toUpperCase()}</TableCell>

          {/* Khách hàng (Tên + SĐT) */}
          <TableCell>
            <Typography fontWeight="bold" fontSize="14px">{row.shippingAddress?.fullname || 'Khách Hàng'}</Typography>
            <Typography fontSize="13px" color="text.secondary">{row.shippingAddress?.phone || 'Chưa cập nhật'}</Typography>
          </TableCell>

          {/* Ngày Đặt */}
          <TableCell>{formatDate(row.createdAt)}</TableCell>

          {/* Tổng Tiền */}
          <TableCell sx={{ color: 'error.main', fontWeight: 'bold' }}>{formatPrice(row.finalPrice)}</TableCell>

          {/* 🌟 TRẠNG THÁI (DROPDOWN THÔNG MINH) */}
          <TableCell onClick={(e) => e.stopPropagation()}> {/* Chặn sự kiện click để không mở collapse khi bấm đổi trạng thái */}
            <Select
              value={row.status}
              onChange={handleStatusChange}
              size="small"
              disabled={row.status === 'DELIVERED' || row.status === 'CANCELLED'} // Khóa cứng nếu đã Giao hoặc Hủy
              sx={{
                bgcolor: currentStatusInfo?.bg,
                color: currentStatusInfo?.color,
                fontWeight: 'bold',
                borderRadius: '20px', // Bo tròn thành hình viên thuốc
                fieldset: { border: 'none' }, // Ẩn viền đi cho đẹp
                '& .MuiSelect-select': { py: 0.8, px: 2 },
                '& .MuiSvgIcon-root': { color: currentStatusInfo?.color }
              }}
            >
              {Object.keys(STATUS_CONFIG).map((statusKey) => {
                const option = STATUS_CONFIG[statusKey]
                // 🌟 LOGIC "CHỈ TIẾN KHÔNG LÙI":
                // Bị Disable nếu Cấp bậc của Option nhỏ hơn hoặc bằng Cấp bậc hiện tại (Trừ Cancelled luôn mở nếu chưa chốt sổ)
                const isDisabled = option.level <= currentStatusInfo.level && statusKey !== row.status && statusKey !== 'CANCELLED'

                return (
                  <MenuItem key={statusKey} value={statusKey} disabled={isDisabled}>
                    {option.label}
                  </MenuItem>
                )
              })}
            </Select>
          </TableCell>
        </TableRow>

        {/* 🌟 THANH TRƯỢT XUỐNG: CHI TIẾT SẢN PHẨM TRONG ĐƠN */}
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 3, my: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Chi tiết đơn hàng</Typography>

                {/* 1. ĐỊA CHỈ GIAO HÀNG (Sửa lại gọi đúng row.shippingAddress.address) */}
                <Box sx={{ mb: 2, p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px dashed #cbd5e1' }}>
                  <Typography variant="body2">
                    <strong>📍 Địa chỉ nhận:</strong> {row.shippingAddress?.address}
                  </Typography>
                  {row.note && <Typography variant="body2" color="error.main" sx={{ mt: 1 }}><strong>📝 Ghi chú:</strong> {row.note}</Typography>}
                </Box>

                {/* 2. DANH SÁCH MÓN HÀNG (Sửa lại gọi đúng mảng row.products) */}
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell>Mã Phân loại (SKU)</TableCell>
                      <TableCell align="right">Đơn giá</TableCell>
                      <TableCell align="center">Số lượng</TableCell>
                      <TableCell align="right">Thành tiền</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Map qua mảng products của fen */}
                    {row.products?.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar src={item.image} variant="rounded" sx={{ width: 40, height: 40 }} />
                            <Typography variant="body2" fontWeight="bold">{item.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell align="right">{formatPrice(item.price)}</TableCell>
                        <TableCell align="center">x{item.quantity}</TableCell>
                        <TableCell align="right" fontWeight="bold" color="error.main">
                          {formatPrice(item.totalPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    )
  }

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 10 }} />

  return (
    <Box sx={{ pb: 5 }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <LocalShippingIcon color="error" fontSize="large" />
        <Typography variant="h5" fontWeight="bold">Quản lý Đơn hàng</Typography>
      </Box>

      {/* THANH TABS LỌC TRẠNG THÁI */}
      <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newVal) => {
            setCurrentTab(newVal)
            setPage(1)
          }}
          textColor="secondary"
          indicatorColor="secondary"
          variant="scrollable"
        >
          <Tab label="TẤT CẢ" value="ALL" sx={{ fontWeight: 'bold' }} />
          <Tab label="CHỜ XÁC NHẬN" value="PENDING" sx={{ fontWeight: 'bold' }} />
          <Tab label="ĐÃ XÁC NHẬN" value="CONFIRMED" sx={{ fontWeight: 'bold' }} />
          <Tab label="ĐANG GIAO" value="SHIPPING" sx={{ fontWeight: 'bold' }} />
          <Tab label="ĐÃ GIAO" value="DELIVERED" sx={{ fontWeight: 'bold' }} />
          <Tab label="ĐÃ HỦY" value="CANCELLED" sx={{ fontWeight: 'bold' }} />
        </Tabs>
      </Paper>

      {/* BẢNG DANH SÁCH ĐƠN HÀNG */}
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell width="40px" />
              <TableCell sx={{ fontWeight: 'bold' }}>Mã Đơn</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Khách Hàng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày Đặt</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tổng Tiền</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng Thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((row) => <OrderRow key={row._id} row={row} />)
            ) : (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>Không có đơn hàng nào!</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* 🌟 THANH CHUYỂN TRANG Ở ĐÂY */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="error"
            size="large"
          />
        </Box>
      )}
    </Box>
  )
}

export default Order