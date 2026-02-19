import {
  Box, Grid, Card, CardContent, Typography, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip
} from '@mui/material'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

// ==========================================
// 📦 MOCK DATA (Dữ liệu giả lập chờ API)
// ==========================================

const mockRevenueData = [
  { name: 'T2', revenue: 12000000 },
  { name: 'T3', revenue: 19000000 },
  { name: 'T4', revenue: 15000000 },
  { name: 'T5', revenue: 28000000 },
  { name: 'T6', revenue: 22000000 },
  { name: 'T7', revenue: 35000000 },
  { name: 'CN', revenue: 42000000 },
]

const mockOrderStatus = [
  { name: 'Chờ xác nhận', value: 15 },
  { name: 'Đang giao', value: 25 },
  { name: 'Đã giao', value: 50 },
  { name: 'Đã huỷ', value: 10 },
]
const PIE_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444']

const mockRecentOrders = [
  { id: 'ORD-1A2B3C', customer: 'Nguyễn Văn A', total: 31000000, status: 'PENDING', date: '19/02/2026' },
  { id: 'ORD-4D5E6F', customer: 'Trần Thị B', total: 15500000, status: 'SHIPPING', date: '19/02/2026' },
  { id: 'ORD-7G8H9I', customer: 'Lê Hoàng C', total: 8900000, status: 'DELIVERED', date: '18/02/2026' },
  { id: 'ORD-9J0K1L', customer: 'Phạm D', total: 24000000, status: 'CANCELLED', date: '18/02/2026' },
]

// Hàm format tiền tệ
const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)

function Dashboard() {

  // Cấu hình 4 thẻ Thống kê (Summary Cards)
  const summaryCards = [
    { title: 'Doanh thu tháng', value: '345.000.000 ₫', icon: <AttachMoneyIcon fontSize="large" />, color: '#10b981', bg: '#d1fae5' },
    { title: 'Tổng đơn hàng', value: '1,245', icon: <ShoppingCartIcon fontSize="large" />, color: '#3b82f6', bg: '#dbeafe' },
    { title: 'Khách hàng mới', value: '128', icon: <PersonAddIcon fontSize="large" />, color: '#8b5cf6', bg: '#ede9fe' },
    { title: 'Sắp hết hàng', value: '12', icon: <WarningAmberIcon fontSize="large" />, color: '#ef4444', bg: '#fee2e2' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning'
      case 'SHIPPING': return 'info'
      case 'DELIVERED': return 'success'
      case 'CANCELLED': return 'error'
      default: return 'default'
    }
  }

  return (
    <Box sx={{ pb: 5 }}>
      {/* ========================================== */}
      {/* TẦNG 1: 4 THẺ THỐNG KÊ (SUMMARY CARDS) */}
      {/* ========================================== */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Avatar sx={{ bgcolor: card.bg, color: card.color, width: 56, height: 56, mr: 2 }}>
                  {card.icon}
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="bold">
                    {card.title.toUpperCase()}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: '#1e293b', mt: 0.5 }}>
                    {card.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ========================================== */}
      {/* TẦNG 2: BIỂU ĐỒ (CHARTS) */}
      {/* ========================================== */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Cột Trái: Biểu đồ Doanh thu (Line Chart) */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', p: 2 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, pl: 2 }}>
              Doanh thu 7 ngày gần nhất
            </Typography>
            <Box sx={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockRevenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip formatter={(value) => formatPrice(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#e11d48" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Cột Phải: Biểu đồ Trạng thái đơn (Pie Chart) */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', p: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, pl: 2 }}>
              Trạng thái đơn hàng
            </Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockOrderStatus}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockOrderStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* ========================================== */}
      {/* TẦNG 3: ĐƠN HÀNG MỚI NHẤT (RECENT ORDERS) */}
      {/* ========================================== */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
          <Typography variant="h6" fontWeight="bold">Đơn hàng mới nhất</Typography>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
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
              {mockRecentOrders.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontWeight: 'medium', color: '#3b82f6' }}>{row.id}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#e11d48' }}>{formatPrice(row.total)}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={getStatusColor(row.status)}
                      size="small"
                      sx={{ fontWeight: 'bold', borderRadius: 1 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}

export default Dashboard