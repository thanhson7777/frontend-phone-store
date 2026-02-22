import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Collapse, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, Avatar, CircularProgress
} from '@mui/material'

// Icons
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SaveIcon from '@mui/icons-material/Save'
import CategoryIcon from '@mui/icons-material/Category'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

// Thư viện ngoài
import { toast } from 'react-toastify'
// import { useConfirm } from 'material-ui-confirm' 

// API
import {
  fetchAdminCategoriesAPI,
  createAdminCategoryAPI,
  updateAdminCategoryAPI,
  deleteAdminCategoryAPI
} from '~/apis'

function Category() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [openAddModal, setOpenAddModal] = useState(false)
  const [expandedRowId, setExpandedRowId] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null) // Dùng cho Dialog Xóa mặc định

  // ==========================================
  // 1. TẢI DỮ LIỆU
  // ==========================================
  const loadData = async () => {
    try {
      setLoading(true)
      const res = await fetchAdminCategoriesAPI()
      if (Array.isArray(res)) setCategories(res)
      else if (res.success) setCategories(res.data)
    } catch (error) {
      console.error('Lỗi lấy danh mục:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  // ==========================================
  // 2. LOGIC THÊM MỚI (MODAL)
  // ==========================================
  const [addData, setAddData] = useState({ name: '', description: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const handleCloseAddModal = () => {
    setOpenAddModal(false)
    setAddData({ name: '', description: '' })
    setImageFile(null)
    setImagePreview(null)
  }

  const handleAddSubmit = async () => {
    if (!addData.name.trim()) return toast.error('Vui lòng nhập tên danh mục!')

    const formData = new FormData()
    formData.append('name', addData.name)
    formData.append('description', addData.description)
    if (imageFile) formData.append('image', imageFile)

    try {
      await toast.promise(
        createAdminCategoryAPI(formData),
        { pending: 'Đang tạo danh mục...', success: 'Thêm danh mục thành công!', error: 'Thêm thất bại!' }
      )
      handleCloseAddModal()
      loadData()
    } catch (error) { console.error(error) }
  }

  // ==========================================
  // 3. LOGIC XÓA (Truyền thống)
  // ==========================================
  const confirmDelete = async () => {
    try {
      await toast.promise(
        deleteAdminCategoryAPI(deleteConfirmId),
        { pending: 'Đang xóa...', success: 'Xóa thành công!', error: 'Xóa thất bại!' }
      )
      setDeleteConfirmId(null)
      loadData()
    } catch (error) { console.error(error) }
  }

  // ==========================================
  // 4. COMPONENT DÒNG DỮ LIỆU (CÓ FORM SỬA TRƯỢT XUỐNG)
  // ==========================================
  const CategoryRow = ({ row }) => {
    const isExpanded = expandedRowId === row._id

    // State riêng cho Form Sửa của dòng này
    const [editData, setEditData] = useState({ name: row.name, description: row.description || '' })
    const [editImgFile, setEditImgFile] = useState(null)
    const [editImgPreview, setEditImgPreview] = useState(row.image)

    const handleUpdateSubmit = async () => {
      const formData = new FormData()
      formData.append('name', editData.name)
      formData.append('description', editData.description)
      if (editImgFile) formData.append('image', editImgFile)

      try {
        await toast.promise(
          updateAdminCategoryAPI(row._id, formData),
          { pending: 'Đang cập nhật...', success: 'Cập nhật thành công!', error: 'Lỗi cập nhật!' }
        )
        setExpandedRowId(null) // Đóng thanh trượt
        loadData()
      } catch (error) { console.error(error) }
    }

    return (
      <>
        {/* DÒNG HIỂN THỊ CHÍNH */}
        <TableRow hover onClick={() => setExpandedRowId(isExpanded ? null : row._id)} sx={{ cursor: 'pointer' }}>
          <TableCell width="50px">
            <IconButton size="small"><KeyboardArrowDownIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} /></IconButton>
          </TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar variant="rounded" src={row.image} alt={row.name} />
              <Typography fontWeight="bold">{row.name}</Typography>
            </Box>
          </TableCell>
          <TableCell>{row.slug}</TableCell>
          <TableCell align="right">
            <IconButton color="error" onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(row._id) }}>
              <DeleteOutlineIcon />
            </IconButton>
          </TableCell>
        </TableRow>

        {/* THANH TRƯỢT XUỐNG ĐỂ SỬA */}
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 3, my: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Chỉnh sửa: {row.name}</Typography>
                <Grid container spacing={3}>
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
                  <Grid item xs={12} md={9}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}><TextField fullWidth label="Tên danh mục" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} size="small" /></Grid>
                      <Grid item xs={12}><TextField fullWidth label="Mô tả" multiline rows={3} value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} size="small" /></Grid>
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
          <CategoryIcon color="error" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">Quản lý Danh mục</Typography>
        </Box>
        <Button variant="contained" color="error" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)}>Thêm Danh Mục</Button>
      </Box>

      {/* BẢNG DANH MỤC */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell width="50px" />
              <TableCell sx={{ fontWeight: 'bold' }}>Tên Danh Mục</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Đường dẫn (Slug)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories
              .filter(row => !row._destroy) // Lọc danh mục đã xóa mềm
              .map((row) => <CategoryRow key={row._id} row={row} />)
            }
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL THÊM MỚI */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm Danh Mục Mới</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ border: '1px dashed #94a3b8', borderRadius: 2, p: 2, textAlign: 'center', mb: 3 }}>
            {imagePreview ? (
              <Avatar src={imagePreview} variant="rounded" sx={{ width: '100%', height: 150, mb: 2, objectFit: 'cover' }} />
            ) : (
              <Box sx={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f1f5f9', mb: 2, borderRadius: 2 }}>
                <Typography color="text.secondary">Chưa chọn ảnh</Typography>
              </Box>
            )}
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              Tải ảnh lên
              <input type="file" hidden accept="image/*" onChange={(e) => {
                if (e.target.files[0]) {
                  setImageFile(e.target.files[0])
                  setImagePreview(URL.createObjectURL(e.target.files[0]))
                }
              }} />
            </Button>
          </Box>
          <TextField fullWidth label="Tên danh mục *" sx={{ mb: 2 }} value={addData.name} onChange={e => setAddData({ ...addData, name: e.target.value })} />
          <TextField fullWidth label="Mô tả" multiline rows={3} value={addData.description} onChange={e => setAddData({ ...addData, description: e.target.value })} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAddModal}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleAddSubmit}>Lưu Danh Mục</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG XÓA */}
      <Dialog open={Boolean(deleteConfirmId)} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle color="error">Xác nhận xóa</DialogTitle>
        <DialogContent><Typography>Xóa danh mục này chứ?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>Xóa ngay</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Category