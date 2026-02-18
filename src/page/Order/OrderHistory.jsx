import { useState, useEffect } from 'react'
import {
  Box, Container, Typography, Tabs, Tab, Card, Divider,
  Button, Chip, Stack
} from '@mui/material'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getUserOrdersAPI, canCelOrderAPI } from '~/apis'

// const MOCK_API = () => new Promise(resolve => setTimeout(() => resolve([]), 500))

// Cấu hình các Tab và Trạng thái
const ORDER_TABS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xác nhận', color: 'warning' },
  { value: 'SHIPPING', label: 'Đang giao', color: 'info' },
  { value: 'DELIVERED', label: 'Đã giao', color: 'success' },
  { value: 'CANCELLED', label: 'Đã huỷ', color: 'error' }
]

function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [currentTab, setCurrentTab] = useState('ALL')
  const [loading, setLoading] = useState(true)

  // 1. Gọi API lấy danh sách đơn hàng khi vào trang
  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await getUserOrdersAPI()
      const orderData = res?.data || res?.orders || res
      if (Array.isArray(orderData)) {
        setOrders(orderData)
      } else {
        console.log('Phát hiện data lạ, không phải mảng:', res)
        setOrders([])
      }
    } catch (error) {
      toast.error('Không thể tải danh sách đơn hàng!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // 2. Logic Lọc đơn hàng theo Tab
  const filteredOrders = orders.filter(order => {
    if (currentTab === 'ALL') return true
    return order.status === currentTab
  })

  // 3. Hàm xử lý Huỷ Đơn Hàng
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn huỷ đơn hàng này không?')) return

    try {
      // Gọi API huỷ đơn của fen
      await canCelOrderAPI(orderId)
      toast.success('Đã huỷ đơn hàng thành công!')
      // Gọi lại API lấy danh sách mới để UI tự cập nhật
      fetchOrders()
    } catch (error) {
      toast.error('Huỷ đơn thất bại, vui lòng thử lại!')
    }
  }

  // 4. Các hàm tiện ích (Format giá, ngày)
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return `${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${date.toLocaleDateString('vi-VN')}`
  }

  const getStatusColor = (status) => {
    const tab = ORDER_TABS.find(t => t.value === status)
    return tab?.color || 'default'
  }

  const getStatusLabel = (status) => {
    const tab = ORDER_TABS.find(t => t.value === status)
    return tab?.label || status
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
        <ReceiptLongIcon color="error" fontSize="large" />
        <Typography variant="h5" fontWeight="bold">Đơn hàng của tôi</Typography>
      </Box>

      {/* THANH TABS LỌC TRẠNG THÁI */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, bgcolor: '#fff' }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          textColor="secondary"
          indicatorColor="secondary"
        >
          {ORDER_TABS.map(tab => (
            <Tab key={tab.value} label={tab.label} value={tab.value} sx={{ fontWeight: 'bold' }} />
          ))}
        </Tabs>
      </Box>

      {/* TRẠNG THÁI RỖNG (EMPTY STATE) */}
      {!loading && filteredOrders.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#fff', borderRadius: 2 }}>
          <ShoppingBagOutlinedIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có đơn hàng nào
          </Typography>
          <Button component={Link} to="/" variant="outlined" color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
            Tiếp tục mua sắm
          </Button>
        </Box>
      )}

      {/* DANH SÁCH ĐƠN HÀNG */}
      <Stack spacing={3}>
        {filteredOrders.map((order) => (
          <Card key={order._id} sx={{ p: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>

            {/* TẦNG 1: HEADER (Mã đơn & Trạng thái) */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
              <Typography variant="body2" color="text.secondary" fontWeight="bold">
                MÃ ĐƠN: #{order._id.slice(-8).toUpperCase()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(order.createdAt)}
                </Typography>
                <Chip
                  label={getStatusLabel(order.status).toUpperCase()}
                  color={getStatusColor(order.status)}
                  size="small"
                  sx={{ fontWeight: 'bold', borderRadius: 1 }}
                />
              </Box>
            </Box>

            {/* TẦNG 2: DANH SÁCH SẢN PHẨM */}
            <Box sx={{ p: 2 }}>
              {order.products.map((item, index) => (
                <Box key={`${item.productId}-${index}`} sx={{ display: 'flex', gap: 2, mb: order.products.length > 1 && index !== order.products.length - 1 ? 2 : 0 }}>
                  <Box component="img" src={item.image} alt={item.name} sx={{ width: 80, height: 80, objectFit: 'contain', border: '1px solid #eee', borderRadius: 1 }} />
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phân loại: {item.sku.split('-').slice(1).join(' ')}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">x{item.quantity}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" color="error.main" fontWeight="bold">
                      {formatPrice(item.price)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* TẦNG 3: FOOTER (Tổng tiền & Nút thao tác) */}
            <Box sx={{ p: 2, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fffaf9' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Tổng số tiền:</Typography>
                <Typography variant="h6" color="error.main" fontWeight="bold">
                  {formatPrice(order.finalPrice)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {/* Nút thao tác dựa trên trạng thái */}
                {order.status === 'PENDING' && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleCancelOrder(order._id)}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Huỷ đơn hàng
                  </Button>
                )}

                {order.status === 'DELIVERED' && (
                  <Button variant="contained" color="error" sx={{ fontWeight: 'bold' }}>
                    Mua lại
                  </Button>
                )}
              </Box>
            </Box>

          </Card>
        ))}
      </Stack>
    </Container>
  )
}

export default OrderHistory