import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Collapse, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, Avatar, CircularProgress,
  Switch, Select, MenuItem, FormControl, InputLabel, Tooltip
} from '@mui/material'

// Icons
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SaveIcon from '@mui/icons-material/Save'
import ImageIcon from '@mui/icons-material/Image'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

// Thư viện ngoài
import { toast } from 'react-toastify'

// API
import {
  fetchAdminBannersAPI,
  createAdminBannerAPI,
  updateAdminBannerAPI,
  deleteAdminBannerAPI
} from '~/apis'

// Chuyển đổi ISO Date sang định dạng của input type="datetime-local"
const toInputDateTime = (isoString) => {
  if (!isoString) return ''
  const d = new Date(isoString)
  const tzOffset = d.getTimezoneOffset() * 60000
  return (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16)
}

// Format ngày hiển thị
const formatDateUI = (timestamp) => {
  if (!timestamp) return 'Không giới hạn'
  return new Date(timestamp).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function Banner() {
  const [banners, setBanners] = useState([])
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
      const res = await fetchAdminBannersAPI()
      if (Array.isArray(res)) setBanners(res)
      else if (res?.banners) setBanners(res.banners)
      else setBanners([])
    } catch (error) {
      console.error('Lỗi lấy banners:', error)
      setBanners([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  // ==========================================
  // 2. LOGIC THÊM MỚI (MODAL)
  // ==========================================
  const [addData, setAddData] = useState({
    title: '',
    subtitle: '',
    link: '',
    linkType: 'none',
    position: 0,
    startDate: '',
    endDate: '',
    isActive: true
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const handleCloseAddModal = () => {
    setOpenAddModal(false)
    setAddData({ title: '', subtitle: '', link: '', linkType: 'none', position: 0, startDate: '', endDate: '', isActive: true })
    setImageFile(null)
    setImagePreview(null)
  }

  const handleAddSubmit = async () => {
    if (!addData.title.trim()) return toast.error('Vui lòng nhập tiêu đề banner!')
    if (!imageFile) return toast.error('Vui lòng chọn hình ảnh!')

    const formData = new FormData()
    formData.append('title', addData.title)
    formData.append('subtitle', addData.subtitle)
    formData.append('link', addData.link)
    formData.append('linkType', addData.linkType)
    formData.append('position', addData.position)
    formData.append('isActive', addData.isActive)
    if (addData.startDate) formData.append('startDate', new Date(addData.startDate).getTime())
    if (addData.endDate) formData.append('endDate', new Date(addData.endDate).getTime())
    formData.append('image', imageFile)

    try {
      await toast.promise(
        createAdminBannerAPI(formData),
        { pending: 'Đang tạo banner...', success: 'Thêm banner thành công!', error: 'Thêm thất bại!' }
      )
      handleCloseAddModal()
      loadData()
    } catch (error) { console.error(error) }
  }

  // ==========================================
  // 3. LOGIC XÓA
  // ==========================================
  const confirmDelete = async () => {
    try {
      await toast.promise(
        deleteAdminBannerAPI(deleteConfirmId),
        { pending: 'Đang xóa...', success: 'Xóa thành công!', error: 'Xóa thất bại!' }
      )
      setDeleteConfirmId(null)
      loadData()
    } catch (error) { console.error(error) }
  }

  // ==========================================
  // 4. COMPONENT DÒNG DỮ LIỆU
  // ==========================================
  const BannerRow = ({ row }) => {
    const isExpanded = expandedRowId === row._id

    // State riêng cho Form Sửa
    const [editData, setEditData] = useState({
      title: row.title,
      subtitle: row.subtitle || '',
      link: row.link || '',
      linkType: row.linkType || 'none',
      position: row.position || 0,
      isActive: row.isActive,
      startDate: toInputDateTime(row.startDate),
      endDate: toInputDateTime(row.endDate)
    })
    const [editImgFile, setEditImgFile] = useState(null)
    const [editImgPreview, setEditImgPreview] = useState(row.image)

    const handleUpdateSubmit = async () => {
      const formData = new FormData()
      formData.append('title', editData.title)
      formData.append('subtitle', editData.subtitle)
      formData.append('link', editData.link)
      formData.append('linkType', editData.linkType)
      formData.append('position', editData.position)
      formData.append('isActive', editData.isActive)
      if (editData.startDate) formData.append('startDate', new Date(editData.startDate).getTime())
      if (editData.endDate) formData.append('endDate', new Date(editData.endDate).getTime())
      if (editImgFile) formData.append('image', editImgFile)

      try {
        await toast.promise(
          updateAdminBannerAPI(row._id, formData),
          { pending: 'Đang cập nhật...', success: 'Cập nhật thành công!', error: 'Lỗi cập nhật!' }
        )
        setExpandedRowId(null)
        loadData()
      } catch (error) { console.error(error) }
    }

    // Toggle trạng thái nhanh
    const handleToggleStatus = async (e) => {
      e.stopPropagation()
      try {
        await updateAdminBannerAPI(row._id, { isActive: e.target.checked })
        loadData()
      } catch (error) { toast.error('Không thể đổi trạng thái') }
    }

    return (
      <>
        {/* DÒNG HIỂN THỊ CHÍNH */}
        <TableRow hover onClick={() => setExpandedRowId(isExpanded ? null : row._id)} sx={{ cursor: 'pointer', '& > *': { borderBottom: 'unset' } }}>
          <TableCell width="50px">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DragIndicatorIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              <IconButton size="small">
                <KeyboardArrowDownIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
              </IconButton>
            </Box>
          </TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                variant="rounded"
                src={row.image}
                sx={{ width: 80, height: 50, bgcolor: 'grey.200' }}
              >
                <ImageIcon />
              </Avatar>
              <Box>
                <Typography fontWeight="bold">{row.title}</Typography>
                {row.subtitle && (
                  <Typography variant="caption" color="text.secondary">
                    {row.subtitle.length > 50 ? row.subtitle.slice(0, 50) + '...' : row.subtitle}
                  </Typography>
                )}
              </Box>
            </Box>
          </TableCell>
          <TableCell>
            <Typography variant="body2" color="text.secondary">
              {row.linkType === 'none' ? 'Không có liên kết' : row.linkType}
            </Typography>
            {row.link && (
              <Typography variant="caption" sx={{ color: 'primary.main', maxWidth: 150, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {row.link}
              </Typography>
            )}
          </TableCell>
          <TableCell>
            <Typography variant="body2">Vị trí: <strong>{row.position}</strong></Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2">{formatDateUI(row.startDate)}</Typography>
            <Typography variant="body2" color="text.secondary">đến {formatDateUI(row.endDate)}</Typography>
          </TableCell>
          <TableCell onClick={(e) => e.stopPropagation()}>
            <Switch color="success" checked={row.isActive} onChange={handleToggleStatus} />
          </TableCell>
          <TableCell align="right">
            <IconButton color="error" onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(row._id) }}>
              <DeleteOutlineIcon />
            </IconButton>
          </TableCell>
        </TableRow>

        {/* THANH TRƯỢT SỬA */}
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 3, my: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Chỉnh sửa: {row.title}</Typography>
                <Grid container spacing={3}>
                  {/* Hình ảnh */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ border: '1px dashed #94a3b8', borderRadius: 2, p: 2, textAlign: 'center', bgcolor: '#fff' }}>
                      <Avatar src={editImgPreview} variant="rounded" sx={{ width: '100%', height: 120, mb: 2, objectFit: 'cover' }} />
                      <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} size="small">
                        Đổi Ảnh
                        <input type="file" hidden accept="image/*" onChange={(e) => {
                          if (e.target.files[0]) {
                            setEditImgFile(e.target.files[0])
                            setEditImgPreview(URL.createObjectURL(e.target.files[0]))
                          }
                        }} />
                      </Button>
                    </Box>
                  </Grid>

                  {/* Form */}
                  <Grid item xs={12} md={9}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Tiêu đề banner *" value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} size="small" />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Phụ đề" value={editData.subtitle} onChange={e => setEditData({ ...editData, subtitle: e.target.value })} size="small" />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Loại liên kết</InputLabel>
                          <Select value={editData.linkType} label="Loại liên kết" onChange={e => setEditData({ ...editData, linkType: e.target.value })}>
                            <MenuItem value="none">Không có liên kết</MenuItem>
                            <MenuItem value="product">Sản phẩm</MenuItem>
                            <MenuItem value="category">Danh mục</MenuItem>
                            <MenuItem value="promotion">Khuyến mãi</MenuItem>
                            <MenuItem value="external">Link ngoài</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Liên kết" value={editData.link} onChange={e => setEditData({ ...editData, link: e.target.value })} size="small" placeholder="VD: /product/abc hoặc https://..." />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField fullWidth label="Vị trí hiển thị" type="number" value={editData.position} onChange={e => setEditData({ ...editData, position: e.target.value })} size="small" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField fullWidth label="Bắt đầu" type="datetime-local" InputLabelProps={{ shrink: true }} value={editData.startDate} onChange={e => setEditData({ ...editData, startDate: e.target.value })} size="small" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField fullWidth label="Kết thúc" type="datetime-local" InputLabelProps={{ shrink: true }} value={editData.endDate} onChange={e => setEditData({ ...editData, endDate: e.target.value })} size="small" />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      <Button variant="outlined" color="inherit" onClick={() => setExpandedRowId(null)}>Hủy</Button>
                      <Button variant="contained" color="error" startIcon={<SaveIcon />} onClick={handleUpdateSubmit}>Lưu thay đổi</Button>
                    </Box>
                  </Grid>
                </Grid>
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
          <ImageIcon color="error" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">Quản lý Banner</Typography>
        </Box>
        <Button variant="contained" color="error" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)}>Thêm Banner</Button>
      </Box>

      {/* BẢNG BANNER */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell width="80px">Sắp xếp</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Banner</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Liên kết</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Vị trí</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Thời gian</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Chưa có banner nào. Nhấn "Thêm Banner" để tạo mới!</Typography>
                </TableCell>
              </TableRow>
            ) : (
              banners.map((row) => <BannerRow key={row._id} row={row} />)
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL THÊM MỚI */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="md" fullWidth>
        <DialogTitle fontWeight="bold">Thêm Banner Mới</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ border: '1px dashed #94a3b8', borderRadius: 2, p: 2, textAlign: 'center', mb: 3 }}>
            {imagePreview ? (
              <Avatar src={imagePreview} variant="rounded" sx={{ width: '100%', height: 200, mb: 2, objectFit: 'cover' }} />
            ) : (
              <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f1f5f9', mb: 2, borderRadius: 2 }}>
                <Typography color="text.secondary">Chưa chọn ảnh banner</Typography>
              </Box>
            )}
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              Tải ảnh banner
              <input type="file" hidden accept="image/*" onChange={(e) => {
                if (e.target.files[0]) {
                  setImageFile(e.target.files[0])
                  setImagePreview(URL.createObjectURL(e.target.files[0]))
                }
              }} />
            </Button>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Tiêu đề banner *" value={addData.title} onChange={e => setAddData({ ...addData, title: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Phụ đề" value={addData.subtitle} onChange={e => setAddData({ ...addData, subtitle: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Loại liên kết</InputLabel>
                <Select value={addData.linkType} label="Loại liên kết" onChange={e => setAddData({ ...addData, linkType: e.target.value })}>
                  <MenuItem value="none">Không có liên kết</MenuItem>
                  <MenuItem value="product">Sản phẩm</MenuItem>
                  <MenuItem value="category">Danh mục</MenuItem>
                  <MenuItem value="promotion">Khuyến mãi</MenuItem>
                  <MenuItem value="external">Link ngoài</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Liên kết" value={addData.link} onChange={e => setAddData({ ...addData, link: e.target.value })} placeholder="VD: /product/abc" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Vị trí hiển thị" type="number" value={addData.position} onChange={e => setAddData({ ...addData, position: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Bắt đầu" type="datetime-local" InputLabelProps={{ shrink: true }} value={addData.startDate} onChange={e => setAddData({ ...addData, startDate: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Kết thúc" type="datetime-local" InputLabelProps={{ shrink: true }} value={addData.endDate} onChange={e => setAddData({ ...addData, endDate: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAddModal}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleAddSubmit}>Lưu Banner</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG XÓA */}
      <Dialog open={Boolean(deleteConfirmId)} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle color="error">Xác nhận xóa</DialogTitle>
        <DialogContent><Typography>Bạn có chắc chắn muốn xóa banner này?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>Xóa ngay</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Banner
