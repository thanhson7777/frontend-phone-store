import {
  Box, Grid, Typography, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip
} from '@mui/material'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as RechartsTooltip
} from 'recharts'

import { fetchAdminDashboardAPI } from '~/apis'
import { useEffect, useState } from 'react'


// Hàm format tiền tệ
const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN')

const STATUS_COLORS = {
  PENDING: 'warning',
  SHIPPING: 'info',
  DELIVERED: 'success',
  CANCELLED: 'error'
}

// Bảng màu cho Biểu đồ tròn
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true)
        const response = await fetchAdminDashboardAPI()
        console.log('response', response)

        if (response.success) {
          setDashboardData(response.data)
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu Dashboard:', error)
        // toast.error('Không thể tải dữ liệu thống kê!')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  // ==========================================
  // HIỂN THỊ MÀN HÌNH LOADING TRONG LÚC CHỜ API
  // ==========================================
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress color="error" />
        <Typography sx={{ ml: 2, fontWeight: 'bold', color: 'text.secondary' }}>Đang tải dữ liệu tổng quan...</Typography>
      </Box>
    )
  }

  // Nếu API lỗi và không có data
  if (!dashboardData) return <Typography color="error">Không có dữ liệu để hiển thị.</Typography>

  const { summary, charts, recentOrders } = dashboardData

  return (
    <Box sx={{ pb: 5 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, color: '#1e293b' }}>
        Tổng Quan Cửa Hàng
      </Typography>

      {/* ========================================== */}
      {/* 1. KHỐI SUMMARY (4 THẺ THỐNG KÊ) */}
      {/* ========================================== */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Tổng Doanh Thu', value: formatPrice(summary.totalRevenue), color: '#10b981' },
          { title: 'Tổng Đơn Hàng', value: `${summary.totalOrders} đơn`, color: '#3b82f6' },
          { title: 'Khách Hàng Mới', value: `${summary.totalUsers} người`, color: '#8b5cf6' },
          { title: 'Sản phẩm Sắp Hết Hàng', value: `${summary.lowStockProducts} sản phẩm`, color: '#ef4444' }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, borderLeft: `5px solid ${item.color}` }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">{item.title}</Typography>
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 1, color: item.color }}>
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ========================================== */}
      {/* 2. KHỐI BIỂU ĐỒ (CHARTS) */}
      {/* ========================================== */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Biểu đồ Doanh thu (Line Chart) */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>Doanh thu 7 ngày qua</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.revenueOverTime}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis
                  axisLine={false} tickLine={false} tick={{ fill: '#64748b' }}
                  tickFormatter={(value) => `${value / 1000000}M`} // Rút gọn số 0 cho đẹp
                />
                <RechartsTooltip formatter={(value) => formatPrice(value)} labelStyle={{ color: '#000' }} />
                <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Biểu đồ Trạng thái Đơn hàng (Pie Chart) */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Tỉ lệ Đơn hàng</Typography>
            <Box sx={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.orderStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value"
                  >
                    {charts.orderStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ========================================== */}
      {/* 3. BẢNG 5 ĐƠN HÀNG MỚI NHẤT */}
      {/* ========================================== */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#1e293b' }}>Đơn hàng gần đây</Typography>
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow hover={true}>
              <TableCell sx={{ fontWeight: 'bold' }}>Mã Đơn</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Khách Hàng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày Đặt</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tổng Tiền</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng Thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentOrders.length > 0 ? recentOrders.map((row) => (
              <TableRow key={row._id}>
                <TableCell sx={{ fontWeight: 'bold', color: '#64748b' }}>#{row._id.slice(-8).toUpperCase()}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">{row.customerName}</Typography>
                  <Typography variant="caption" color="text.secondary">{row.phone}</Typography>
                </TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#ef4444' }}>{formatPrice(row.totalPrice)}</TableCell>
                <TableCell>
                  <Chip label={row.status} color={STATUS_COLORS[row.status] || 'default'} size="small" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }} />
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>Chưa có đơn hàng nào.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default Dashboard