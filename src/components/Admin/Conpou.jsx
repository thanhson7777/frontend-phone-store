import { useState } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Collapse, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, Switch, LinearProgress,
  MenuItem, Select, FormControl, InputLabel, Tooltip
} from '@mui/material'

// Icons
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import SaveIcon from '@mui/icons-material/Save'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'

const mockCoupons = [
  {
    _id: 'C1', code: 'SUMMER2026',
    discount: { type: 'FIXED', value: 300000, maxAmount: null },
    startDate: '2026-01-01T00:00', endDate: '2026-08-31T23:59',
    quantity: 200, usedCount: 45, status: true
  },
  {
    _id: 'C2', code: 'NEWBIE10',
    discount: { type: 'PERCENTAGE', value: 10, maxAmount: 500000 },
    startDate: '2026-02-01T00:00', endDate: '2026-12-31T23:59',
    quantity: 500, usedCount: 0, status: true
  },
  {
    _id: 'C3', code: 'FLASHCANCELED',
    discount: { type: 'FIXED', value: 50000, maxAmount: null },
    startDate: '2026-02-15T00:00', endDate: '2026-02-28T23:59',
    quantity: 100, usedCount: 100, status: false
  }
]

// Hàm format
const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
const formatDate = (dateString) => new Date(dateString).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })

function Conpou() {
  const [coupons, setCoupons] = useState(mockCoupons)

  // State UI
  const [expandedRowId, setExpandedRowId] = useState(null)
  const [openAddModal, setOpenAddModal] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // ==========================================
  // STATE & HÀM CHO MODAL THÊM MỚI
  // ==========================================
  const [newCoupon, setNewCoupon] = useState({
    code: '', type: 'FIXED', value: '', maxAmount: '', startDate: '', endDate: '', quantity: ''
  })

  const handleCloseAddModal = () => {
    setOpenAddModal(false)
    setNewCoupon({ code: '', type: 'FIXED', value: '', maxAmount: '', startDate: '', endDate: '', quantity: '' })
  }

  // ==========================================
  // COMPONENT DÒNG DỮ LIỆU (ROW & COLLAPSE)
  // ==========================================
  const CouponRow = ({ row }) => {
    const isExpanded = expandedRowId === row._id
    const isUsed = row.usedCount > 0 // Kiểm tra xem mã đã có người xài chưa
    const usagePercent = Math.min((row.usedCount / row.quantity) * 100, 100)

    // State nội bộ cho form Sửa
    const [editData, setEditData] = useState({
      type: row.discount.type,
      value: row.discount.value,
      maxAmount: row.discount.maxAmount || '',
      endDate: row.endDate,
      quantity: row.quantity,
      status: row.status
    })

    const handleToggleExpand = (id) => setExpandedRowId(expandedRowId === id ? null : id)

    return (
      <>
        {/* DÒNG HIỂN THỊ CHÍNH */}
        <TableRow hover onClick={() => handleToggleExpand(row._id)} sx={{ cursor: 'pointer', '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleToggleExpand(row._id); }}>
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>
            <Typography fontWeight="bold" color="error.main" sx={{ letterSpacing: 1 }}>{row.code}</Typography>
          </TableCell>
          <TableCell>
            <Typography fontWeight="bold">
              {row.discount.type === 'FIXED' ? formatPrice(row.discount.value) : `Giảm ${row.discount.value}%`}
            </Typography>
            {row.discount.type === 'PERCENTAGE' && (
              <Typography variant="caption" color="text.secondary">Tối đa: {formatPrice(row.discount.maxAmount)}</Typography>
            )}
          </TableCell>
          <TableCell>
            <Typography variant="body2">{formatDate(row.startDate)}</Typography>
            <Typography variant="body2" color="text.secondary">đến {formatDate(row.endDate)}</Typography>
          </TableCell>
          <TableCell sx={{ minWidth: 120 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" fontWeight="bold">{row.usedCount} / {row.quantity}</Typography>
              <Typography variant="caption" color="text.secondary">{Math.round(usagePercent)}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate" value={usagePercent}
              color={usagePercent >= 100 ? 'error' : 'primary'}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </TableCell>
          <TableCell>
            <Switch
              checked={row.status} size="small" color="success"
              onClick={(e) => e.stopPropagation()} // Chặn click lan ra dòng
            />
          </TableCell>
          <TableCell align="right">
            <IconButton color="error" onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(row._id); }}>
              <DeleteOutlineIcon />
            </IconButton>
          </TableCell>
        </TableRow>

        {/* KHUNG TRƯỢT XUỐNG ĐỂ SỬA */}
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 3, my: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3 }}>
                  Cập nhật mã: <span style={{ color: '#e11d48' }}>{row.code}</span>
                  {isUsed && <Typography component="span" variant="caption" color="error" sx={{ ml: 2 }}>(*Mã đã được sử dụng, không thể sửa loại giảm giá)</Typography>}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth size="small" disabled={isUsed}>
                      <InputLabel>Loại giảm giá</InputLabel>
                      <Select
                        value={editData.type} label="Loại giảm giá"
                        onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                      >
                        <MenuItem value="FIXED">Giảm tiền mặt (VNĐ)</MenuItem>
                        <MenuItem value="PERCENTAGE">Giảm theo phần trăm (%)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={editData.type === 'PERCENTAGE' ? 3 : 4}>
                    <TextField
                      fullWidth size="small" label={editData.type === 'FIXED' ? 'Số tiền giảm' : 'Phần trăm giảm (%)'}
                      type="number" value={editData.value} disabled={isUsed}
                      onChange={(e) => setEditData({ ...editData, value: e.target.value })}
                    />
                  </Grid>

                  {/* 🌟 Ô Nhập tối đa: Chỉ hiện khi là phần trăm */}
                  {editData.type === 'PERCENTAGE' && (
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth size="small" label="Giảm tối đa (VNĐ)" type="number"
                        value={editData.maxAmount} disabled={isUsed}
                        onChange={(e) => setEditData({ ...editData, maxAmount: e.target.value })}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} md={3}>
                    <TextField fullWidth size="small" label="Ngày kết thúc" type="datetime-local" InputLabelProps={{ shrink: true }} value={editData.endDate} onChange={(e) => setEditData({ ...editData, endDate: e.target.value })} />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField fullWidth size="small" label="Tổng số lượng mã" type="number" value={editData.quantity} onChange={(e) => setEditData({ ...editData, quantity: e.target.value })} />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined" color="inherit" onClick={() => setExpandedRowId(null)}>Hủy</Button>
                  <Button variant="contained" color="error" startIcon={<SaveIcon />}>Cập nhật thay đổi</Button>
                </Box>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    )
  }

  return (
    <Box sx={{ pb: 5 }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ConfirmationNumberIcon color="error" fontSize="large" />
          <Typography variant="h5" fontWeight="bold" color="#1e293b">Mã Giảm Giá</Typography>
        </Box>
        <Button variant="contained" color="error" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)} sx={{ fontWeight: 'bold' }}>
          Tạo Mã Mới
        </Button>
      </Box>

      {/* BẢNG DANH SÁCH */}
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow hover={true}>
              <TableCell width="50px" />
              <TableCell sx={{ fontWeight: 'bold' }}>Mã Code</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Mức Giảm</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Thời Hạn</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Đã Dùng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng Thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((row) => (
              <CouponRow key={row._id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ========================================== */}
      {/* MODAL THÊM MÃ MỚI */}
      {/* ========================================== */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Tạo Mã Giảm Giá Mới</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="Mã Code" placeholder="VD: SIEUSALE2026"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Loại giảm giá</InputLabel>
                <Select
                  value={newCoupon.type} label="Loại giảm giá"
                  onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                >
                  <MenuItem value="FIXED">Giảm tiền mặt (VNĐ)</MenuItem>
                  <MenuItem value="PERCENTAGE">Giảm theo phần trăm (%)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={newCoupon.type === 'PERCENTAGE' ? 6 : 12}>
              <TextField
                fullWidth label={newCoupon.type === 'FIXED' ? 'Số tiền giảm (VNĐ)' : 'Phần trăm giảm (%)'} type="number"
                value={newCoupon.value} onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
              />
            </Grid>

            {/* 🌟 Dynamic Field: Hiện khi chọn giảm phần trăm */}
            {newCoupon.type === 'PERCENTAGE' && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Giảm tối đa (VNĐ)" type="number"
                  value={newCoupon.maxAmount} onChange={(e) => setNewCoupon({ ...newCoupon, maxAmount: e.target.value })}
                />
              </Grid>
            )}

            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Số lượng mã phát ra" type="number" value={newCoupon.quantity} onChange={(e) => setNewCoupon({ ...newCoupon, quantity: e.target.value })} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Ngày bắt đầu" type="datetime-local" InputLabelProps={{ shrink: true }} value={newCoupon.startDate} onChange={(e) => setNewCoupon({ ...newCoupon, startDate: e.target.value })} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Ngày kết thúc" type="datetime-local" InputLabelProps={{ shrink: true }} value={newCoupon.endDate} onChange={(e) => setNewCoupon({ ...newCoupon, endDate: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAddModal} color="inherit">Hủy bỏ</Button>
          <Button variant="contained" color="error">Lưu Mã Mới</Button>
        </DialogActions>
      </Dialog>

      {/* POPUP XÓA */}
      <Dialog open={Boolean(deleteConfirmId)} onClose={() => setDeleteConfirmId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'error.main' }}>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Xóa mã giảm giá này vĩnh viễn? Những người dùng đã lưu mã sẽ không thể sử dụng nữa.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)} color="inherit">Hủy</Button>
          <Button variant="contained" color="error" onClick={() => setDeleteConfirmId(null)}>Xóa ngay</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Conpou