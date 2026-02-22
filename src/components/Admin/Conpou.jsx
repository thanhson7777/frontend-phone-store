import { useState, useEffect } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, IconButton, Collapse, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid, Switch,
  LinearProgress, Select, MenuItem, InputLabel, FormControl, CircularProgress
} from '@mui/material'

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SaveIcon from '@mui/icons-material/Save'
import { toast } from 'react-toastify'

// API (Đảm bảo fen đã có các hàm này trong src/apis/couponAPI.js)
import {
  fetchAdminCouponsAPI,
  createAdminCouponAPI,
  updateAdminCouponAPI,
  deleteAdminCouponAPI
} from '~/apis'

// Hàm Format Tiền và Ngày giờ
const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)

const formatDateTimeUI = (isoString) => {
  if (!isoString) return ''
  const d = new Date(isoString)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`
}

// Chuyển đổi ISO Date sang định dạng của input type="datetime-local" (YYYY-MM-DDThh:mm)
const toInputDateTime = (isoString) => {
  if (!isoString) return ''
  const d = new Date(isoString)
  const tzOffset = d.getTimezoneOffset() * 60000 // Bù trừ múi giờ Việt Nam
  return (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16)
}

function Conpou() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [openAddModal, setOpenAddModal] = useState(false)
  const [expandedRowId, setExpandedRowId] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // ==========================================
  // 1. TẢI DỮ LIỆU
  // ==========================================
  const loadData = async () => {
    try {
      setLoading(true)
      const res = await fetchAdminCouponsAPI()
      if (res.success) setCoupons(res.data)
      else if (Array.isArray(res)) setCoupons(res)
    } catch (error) {
      console.error('Lỗi tải mã giảm giá:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  // ==========================================
  // 2. THÊM MỚI MÃ (MODAL)
  // ==========================================
  const [addData, setAddData] = useState({
    code: '', type: 'FIXED', value: '', maxAmount: '', minOrder: 0,
    quantity: '', startDate: '', endDate: ''
  })

  const handleCloseAddModal = () => {
    setOpenAddModal(false)
    setAddData({ code: '', type: 'FIXED', value: '', maxAmount: '', minOrder: 0, quantity: '', startDate: '', endDate: '' })
  }

  const handleAddSubmit = async () => {
    const payload = {
      code: addData.code.trim().toUpperCase(),
      discount: {
        type: addData.type,
        value: Number(addData.value),
        maxAmount: addData.maxAmount ? Number(addData.maxAmount) : null,
        minOrder: Number(addData.minOrder)
      },
      quantity: Number(addData.quantity),
      startDate: new Date(addData.startDate).getTime(),
      endDate: new Date(addData.endDate).getTime()
    }

    try {
      await toast.promise(createAdminCouponAPI(payload), { pending: 'Đang tạo mã...', success: 'Tạo mã thành công!', error: 'Lỗi tạo mã!' })
      handleCloseAddModal()
      loadData()
    } catch (error) { console.error(error) }
  }

  // ==========================================
  // 3. XÓA MÃ
  // ==========================================
  const confirmDelete = async () => {
    try {
      await toast.promise(deleteAdminCouponAPI(deleteConfirmId), { pending: 'Đang xóa...', success: 'Xóa thành công!', error: 'Lỗi!' })
      setDeleteConfirmId(null)
      loadData()
    } catch (error) { console.error(error) }
  }

  // ==========================================
  // 4. COMPONENT DÒNG MÃ GIẢM GIÁ (CÓ THANH TRƯỢT SỬA)
  // ==========================================
  const CouponRow = ({ row }) => {
    const isExpanded = expandedRowId === row._id
    const isUsed = row.usedCount > 0 // Kiểm tra xem mã đã có người xài chưa
    const percentUsed = row.quantity > 0 ? Math.round((row.usedCount / row.quantity) * 100) : 0

    // Form Edit (Kế thừa từ UI của fen: Chỉ cho sửa 4 trường)
    const [editData, setEditData] = useState({
      type: row.discount.type,
      value: row.discount.value,
      quantity: row.quantity,
      endDate: toInputDateTime(row.endDate)
    })

    const handleUpdateSubmit = async () => {
      const payload = {
        discount: { ...row.discount, type: editData.type, value: Number(editData.value) },
        quantity: Number(editData.quantity),
        startDate: new Date(row.startDate).getTime(),
        endDate: new Date(editData.endDate).getTime()
      }
      try {
        await toast.promise(updateAdminCouponAPI(row._id, payload), { pending: 'Cập nhật...', success: 'Đã lưu thay đổi!', error: 'Lỗi!' })
        setExpandedRowId(null)
        loadData()
      } catch (error) { console.error(error) }
    }

    // Toggle Trạng thái Nhanh (Bật/Tắt)
    const handleToggleStatus = async (e) => {
      e.stopPropagation()
      const newStatus = e.target.checked ? 'active' : 'expired'
      try {
        await updateAdminCouponAPI(row._id, { status: newStatus })
        loadData()
      } catch (error) { toast.error("Không thể đổi trạng thái") }
    }

    return (
      <>
        {/* DÒNG HIỂN THỊ CHÍNH */}
        <TableRow hover onClick={() => setExpandedRowId(isExpanded ? null : row._id)} sx={{ cursor: 'pointer', '& > *': { borderBottom: 'unset' } }}>
          <TableCell width="40px"><IconButton size="small"><KeyboardArrowDownIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} /></IconButton></TableCell>
          <TableCell sx={{ fontWeight: 'bold', color: '#dc2626', fontSize: '15px' }}>{row.code}</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>
            {row.discount.type === 'FIXED' ? formatPrice(row.discount.value) : `${row.discount.value}%`}
          </TableCell>
          <TableCell>
            <Typography fontSize="13px" color="text.secondary">{formatDateTimeUI(row.startDate)}</Typography>
            <Typography fontSize="13px">đến {formatDateTimeUI(row.endDate)}</Typography>
          </TableCell>
          <TableCell width="180px">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" fontWeight="bold">{row.usedCount} / {row.quantity}</Typography>
              <Typography variant="body2" color="text.secondary">{percentUsed}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={percentUsed} color={percentUsed >= 100 ? "error" : "primary"} sx={{ height: 6, borderRadius: 3 }} />
          </TableCell>
          <TableCell onClick={(e) => e.stopPropagation()}>
            <Switch color="success" checked={row.status === 'active'} onChange={handleToggleStatus} />
          </TableCell>
          <TableCell align="right">
            <IconButton color="error" onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(row._id) }}><DeleteOutlineIcon /></IconButton>
          </TableCell>
        </TableRow>

        {/* THANH TRƯỢT SỬA */}
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 3, my: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Cập nhật mã: <span style={{ color: '#dc2626' }}>{row.code}</span>
                  {isUsed && <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: 'normal', marginLeft: '10px' }}>(*Mã đã được sử dụng, không thể sửa loại giảm giá)</span>}
                </Typography>

                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <FormControl fullWidth size="small" disabled={isUsed}>
                      <InputLabel>Loại giảm giá</InputLabel>
                      <Select value={editData.type} label="Loại giảm giá" onChange={(e) => setEditData({ ...editData, type: e.target.value })}>
                        <MenuItem value="FIXED">Giảm tiền mặt (VNĐ)</MenuItem>
                        <MenuItem value="PERCENT">Giảm phần trăm (%)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField fullWidth size="small" label="Số tiền/Phần trăm giảm" type="number" disabled={isUsed && editData.type === 'PERCENT'} value={editData.value} onChange={(e) => setEditData({ ...editData, value: e.target.value })} />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField fullWidth size="small" label="Ngày kết thúc" type="datetime-local" InputLabelProps={{ shrink: true }} value={editData.endDate} onChange={(e) => setEditData({ ...editData, endDate: e.target.value })} />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField fullWidth size="small" label="Tổng số lượng mã" type="number" value={editData.quantity} onChange={(e) => setEditData({ ...editData, quantity: e.target.value })} />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined" color="inherit" onClick={() => setExpandedRowId(null)}>Hủy</Button>
                  <Button variant="contained" color="error" startIcon={<SaveIcon />} onClick={handleUpdateSubmit}>Cập nhật thay đổi</Button>
                </Box>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ConfirmationNumberIcon color="error" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">Mã Giảm Giá</Typography>
        </Box>
        <Button variant="contained" color="error" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)}>Tạo Mã Mới</Button>
      </Box>

      {/* BẢNG MÃ GIẢM GIÁ */}
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell width="40px" />
              <TableCell sx={{ fontWeight: 'bold' }}>Mã Code</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Mức Giảm</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Thời Hạn</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Đã Dùng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng Thái</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((row) => <CouponRow key={row._id} row={row} />)}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL TẠO MÃ MỚI */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="md" fullWidth>
        <DialogTitle fontWeight="bold">Tạo Mã Giảm Giá Mới</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Mã Code (VD: SUMMER2026) *" value={addData.code} onChange={(e) => setAddData({ ...addData, code: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Tổng số lượng mã *" type="number" value={addData.quantity} onChange={(e) => setAddData({ ...addData, quantity: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Loại giảm giá</InputLabel>
                <Select value={addData.type} label="Loại giảm giá" onChange={(e) => setAddData({ ...addData, type: e.target.value })}>
                  <MenuItem value="FIXED">Giảm tiền mặt (VNĐ)</MenuItem>
                  <MenuItem value="PERCENT">Giảm phần trăm (%)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label={addData.type === 'FIXED' ? "Số tiền giảm (VNĐ) *" : "Phần trăm giảm (%) *"} type="number" value={addData.value} onChange={(e) => setAddData({ ...addData, value: e.target.value })} />
            </Grid>

            {/* Chỉ hiện maxAmount nếu là dạng Phần trăm */}
            {addData.type === 'PERCENT' && (
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Giảm tối đa (VNĐ)" type="number" value={addData.maxAmount} onChange={(e) => setAddData({ ...addData, maxAmount: e.target.value })} />
              </Grid>
            )}

            <Grid item xs={12} md={addData.type === 'PERCENT' ? 6 : 12}>
              <TextField fullWidth label="Đơn tối thiểu để áp dụng (VNĐ)" type="number" value={addData.minOrder} onChange={(e) => setAddData({ ...addData, minOrder: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Thời gian bắt đầu *" type="datetime-local" InputLabelProps={{ shrink: true }} value={addData.startDate} onChange={(e) => setAddData({ ...addData, startDate: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Thời gian kết thúc *" type="datetime-local" InputLabelProps={{ shrink: true }} value={addData.endDate} onChange={(e) => setAddData({ ...addData, endDate: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAddModal}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleAddSubmit}>Lưu Mã Khuyến Mãi</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG XÓA */}
      <Dialog open={Boolean(deleteConfirmId)} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle color="error">Xác nhận xóa</DialogTitle>
        <DialogContent><Typography>Bạn có chắc chắn muốn xóa mã giảm giá này?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>Xóa ngay</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Conpou