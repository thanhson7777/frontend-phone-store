import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Collapse, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, Avatar, CircularProgress, Stack
} from '@mui/material'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import PageLoadingSpinner from '../Loading/PageLoadingSpinner'

// Icons
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SaveIcon from '@mui/icons-material/Save'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { toast } from 'react-toastify'
import {
  fetchAdminProductsAPI,
  createAdminProductAPI,
  updateAdminProductAPI,
  deleteAdminProductAPI,
  fetchAdminCategoriesAPI
} from '~/apis'

// Hàm format tiền tệ
const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)

function Product() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [openAddModal, setOpenAddModal] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [expandedRowId, setExpandedRowId] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const [prodRes, catRes] = await Promise.all([
        fetchAdminProductsAPI(),
        fetchAdminCategoriesAPI()
      ])

      if (prodRes.success) {
        setProducts(prodRes.data)
      }

      if (Array.isArray(catRes)) {
        setCategories(catRes)
      } else if (catRes.success) {
        setCategories(catRes.data)
      }

    } catch (error) {
      console.error('Lỗi lấy dữ liệu:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const [addData, setAddData] = useState({ name: '', brand: '', description: '', basePrice: 0, quantity: 0, categoryId: '' })
  const [addVariants, setAddVariants] = useState([{ id: Date.now(), sku: '', color: '', storage: '', price: '' }])

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleCloseAddModal = () => {
    setOpenAddModal(false)
    setAddData({ name: '', brand: '', description: '', basePrice: 0, quantity: 0, categoryId: '' })
    setAddVariants([{ id: Date.now(), sku: '', color: '', storage: '', price: '' }])
    setImageFile(null)
    setImagePreview(null)
  }

  // BẤM NÚT LƯU SẢN PHẨM MỚI
  const handleSubmitAdd = async () => {
    try {
      const validVariants = addVariants.filter(v => v.sku.trim() !== '' && v.color.trim() !== '' && v.storage.trim() !== '')

      if (validVariants.length === 0) {
        alert('Vui lòng nhập đầy đủ thông tin (SKU, Màu, Dung lượng) cho ít nhất 1 phân loại hàng!')
        return
      }

      const cleanedVariants = validVariants.map(variant => {
        const { id, ...restInfo } = variant
        return {
          ...restInfo,
          price: Number(restInfo.price) || 0
        }
      })

      const formData = new FormData()
      formData.append('name', addData.name)
      formData.append('brand', addData.brand)
      formData.append('description', addData.description)
      formData.append('basePrice', Number(addData.basePrice) || 0)
      formData.append('quantity', Number(addData.quantity) || 0)
      formData.append('categoryId', addData.categoryId)

      formData.append('variants', JSON.stringify(cleanedVariants))

      if (imageFile) {
        formData.append('image', imageFile)
      }

      try {
        const res = await toast.promise(
          createAdminProductAPI(formData),
          {
            pending: 'Đang tải dữ liệu...',
            success: 'Thêm điện thoại mới thành công!',
            error: 'Thêm thất bại, vui lòng kiểm tra lại!'
          }
        )
        handleCloseAddModal()
        loadData()

      } catch (error) {
        console.error('Lỗi khi thêm máy mới:', error)
      }
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error)
      toast.error("Có lỗi xảy ra, vui lòng xem console!")
    }
  }

  const handleDeleteClick = (e, id) => {
    e.stopPropagation()
    setDeleteConfirmId(id)
  }

  // ==========================================
  // 3. XÓA SẢN PHẨM
  // ==========================================
  const confirmDelete = async () => {
    try {
      await deleteAdminProductAPI(deleteConfirmId)
      setDeleteConfirmId(null)
      loadData()
    } catch (error) {
      console.error('Lỗi xóa:', error)
    }
  }
  // ==========================================
  // 4. COMPONENT DÒNG DỮ LIỆU (CÓ CHỨA FORM SỬA)
  // ==========================================
  const ProductRow = ({ row }) => {
    const isExpanded = expandedRowId === row._id

    const [editData, setEditData] = useState({
      name: row.name, brand: row.brand, basePrice: row.basePrice, quantity: row.quantity
    })
    const [variants, setVariants] = useState(row.variants?.length ? row.variants : [{ id: Date.now(), sku: '', color: '', storage: '', price: '' }])

    // Ảnh sửa
    const [editImgFile, setEditImgFile] = useState(null)
    const [editImgPreview, setEditImgPreview] = useState(row.image)

    const handleEditImgChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        setEditImgFile(file)
        setEditImgPreview(URL.createObjectURL(file))
      }
    }

    // BẤM LƯU CẬP NHẬT
    const handleUpdateSubmit = async () => {
      try {
        const formData = new FormData()
        formData.append('name', editData.name)
        formData.append('brand', editData.brand)
        formData.append('basePrice', editData.basePrice)
        formData.append('quantity', editData.quantity)
        formData.append('categoryId', row.categoryId)
        formData.append('variants', JSON.stringify(variants))

        if (editImgFile) formData.append('image', editImgFile)

        try {
          const res = await toast.promise(
            updateAdminProductAPI(row._id, formData),
            {
              pending: 'Đang cập nhật sản phẩm...',
              success: 'Cập nhật sản phẩm thành công!',
              error: 'Cập nhật thất bại, vui lòng kiểm tra lại!'
            }
          )
          setExpandedRowId(null)
          loadData()

        } catch (error) {
          console.error('Lỗi khi thêm máy mới:', error)
        }
      } catch (error) {
        console.error('Lỗi cập nhật:', error)
      }
    }

    // Hàm Thêm 1 dòng biến thể mới
    const handleAddVariant = () => {
      setVariants([...variants, { id: Date.now(), sku: '', color: '', storage: '', price: '' }])
    }

    // Hàm Xóa 1 dòng biến thể
    const handleRemoveVariant = (idToRemove) => {
      setVariants(variants.filter(v => v.id !== idToRemove))
    }

    // Hàm Cập nhật dữ liệu khi gõ vào input của 1 dòng cụ thể
    const handleVariantChange = (id, field, value) => {
      setVariants(variants.map(v =>
        v.id === id ? { ...v, [field]: value } : v
      ))
    }

    return (
      <>
        <TableRow hover onClick={() => setExpandedRowId(isExpanded ? null : row._id)} sx={{ cursor: 'pointer', opacity: row._destroy ? 0.5 : 1 }}>
          <TableCell>
            <IconButton size="small"><KeyboardArrowDownIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} /></IconButton>
          </TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar variant="rounded" src={row.image} alt={row.name} />
              <Typography fontWeight="bold">
                {row.name} {row._destroy && <Typography component="span" color="error" variant="caption">(Đã xóa)</Typography>}
              </Typography>
            </Box>
          </TableCell>
          <TableCell>{row.brand}</TableCell>
          <TableCell sx={{ color: 'error.main', fontWeight: 'bold' }}>{formatPrice(row.basePrice)}</TableCell>
          <TableCell>{row.quantity > 0 ? <Typography color="success.main">{row.quantity} cái</Typography> : <Typography color="error.main">Hết hàng</Typography>}</TableCell>
          <TableCell align="right">
            <IconButton color="error" onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(row._id) }}>
              <DeleteOutlineIcon />
            </IconButton>
          </TableCell>
        </TableRow>

        {/* TRƯỢT XUỐNG ĐỂ SỬA */}
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 3, my: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Cập nhật thông tin: {row.name}</Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {/* Cột Upload Ảnh */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ border: '1px dashed #94a3b8', borderRadius: 2, p: 2, textAlign: 'center', bgcolor: '#fff' }}>
                      <Avatar src={editImgPreview} variant="rounded" sx={{ width: '100%', height: 120, mb: 2, objectFit: 'contain' }} />
                      <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} size="small">
                        Đổi Ảnh
                        <input type="file" hidden accept="image/*" onChange={handleEditImgChange} />
                      </Button>
                    </Box>
                  </Grid>

                  {/* Cột Form Info */}
                  <Grid item xs={12} md={9}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}><TextField fullWidth label="Tên sản phẩm" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} size="small" /></Grid>
                      <Grid item xs={12} md={6}><TextField fullWidth label="Thương hiệu" value={editData.brand} onChange={e => setEditData({ ...editData, brand: e.target.value })} size="small" /></Grid>
                      <Grid item xs={12} md={6}><TextField fullWidth label="Giá bán (Mặc định)" value={editData.basePrice} onChange={e => setEditData({ ...editData, basePrice: e.target.value })} size="small" type="number" /></Grid>
                      <Grid item xs={12} md={6}><TextField fullWidth label="Tổng tồn kho" value={editData.quantity} onChange={e => setEditData({ ...editData, quantity: e.target.value })} size="small" type="number" /></Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {/* --- KHU VỰC QUẢN LÝ BIẾN THỂ (GIỮ NGUYÊN UI) --- */}
                {/* ... (Đoạn code map các TextField biến thể của fen giữ nguyên ở đây, nhớ đổi value={variant.price} thành onChange={handleVariantChange...} như cũ) */}
                <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                  <Button variant="outlined" size="small" onClick={handleAddVariant}>Thêm phân loại</Button>
                  {variants.map((v, i) => (
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }} key={v.id || i}>
                      <TextField size="small" label="Mã SKU" value={v.sku} onChange={(e) => handleVariantChange(v.id, 'sku', e.target.value)} />
                      <TextField size="small" label="Màu sắc" value={v.color} onChange={(e) => handleVariantChange(v.id, 'color', e.target.value)} />
                      <TextField size="small" label="Bộ nhớ" value={v.storage} onChange={(e) => handleVariantChange(v.id, 'storage', e.target.value)} />
                      <TextField size="small" type="number" label="Giá" value={v.price} onChange={(e) => handleVariantChange(v.id, 'price', e.target.value)} />
                      <IconButton color="error" onClick={() => handleRemoveVariant(v.id)}><DeleteOutlineIcon /></IconButton>
                    </Stack>
                  ))}
                </Box>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined" color="inherit" onClick={() => setExpandedRowId(null)}>Hủy</Button>
                  <Button variant="contained" color="error" startIcon={<SaveIcon />} onClick={handleUpdateSubmit}>Lưu cập nhật</Button>
                </Box>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    )
  }

  if (loading) return <PageLoadingSpinner caption="Đang tải dữ liệu..." />

  return (
    <Box sx={{ pb: 5 }}>
      {/* HEADER & TABLE GIỮ NGUYÊN */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Quản lý sản phẩm</Typography>
        <Button variant="contained" color="error" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)}>Thêm Mới</Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableBody>
            {products
              .filter(row => row._destroy !== true) // 🌟 LỌC: Chỉ giữ lại những món CHƯA bị xóa
              .map((row) => <ProductRow key={row._id} row={row} />)
            }
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL THÊM SẢN PHẨM MỚI (CÓ CHỌN ẢNH) */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="md" fullWidth>
        <DialogTitle>Thêm Sản Phẩm Mới</DialogTitle>
        <DialogContent dividers>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Box Chọn Ảnh */}
            <Grid item xs={12} md={4}>
              <Box sx={{ border: '1px dashed #94a3b8', borderRadius: 2, p: 2, textAlign: 'center' }}>
                {imagePreview ? (
                  <Avatar src={imagePreview} variant="rounded" sx={{ width: '100%', height: 150, mb: 2, objectFit: 'cover' }} />
                ) : (
                  <Box sx={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f1f5f9', mb: 2, borderRadius: 2 }}>
                    <Typography color="text.secondary">Chưa chọn ảnh</Typography>
                  </Box>
                )}
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} fullWidth>
                  Tải ảnh lên
                  {/* Thẻ input ẩn đi, khi bấm nút sẽ kích hoạt thẻ này */}
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
              </Box>
            </Grid>


            {/* Box Thông tin */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}><TextField fullWidth label="Tên sản phẩm" value={addData.name} onChange={e => setAddData({ ...addData, name: e.target.value })} /></Grid>
                <Grid item xs={12} md={6}><TextField fullWidth label="Thương hiệu" value={addData.brand} onChange={e => setAddData({ ...addData, brand: e.target.value })} /></Grid>
                <Grid item xs={12} md={6}><TextField fullWidth type="number" label="Giá bán (Mặc định)" value={addData.basePrice} onChange={e => setAddData({ ...addData, basePrice: e.target.value })} /></Grid>
                <Grid item xs={12} md={6}><TextField fullWidth type="number" label="Tồn kho" value={addData.quantity} onChange={e => setAddData({ ...addData, quantity: e.target.value })} /></Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Danh mục sản phẩm *</InputLabel>
                    <Select
                      value={addData.categoryId}
                      label="Danh mục sản phẩm *"
                      onChange={e => setAddData({ ...addData, categoryId: e.target.value })}
                    >
                      {/* Lặp danh sách danh mục để in ra các Option */}
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}><TextField fullWidth label="Mô tả" multiline rows={2} value={addData.description} onChange={e => setAddData({ ...addData, description: e.target.value })} /></Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Phân loại hàng (Biến thể) *</Typography>
              <Button
                variant="outlined" color="primary" size="small" startIcon={<AddIcon />}
                onClick={() => setAddVariants([...addVariants, { id: Date.now(), sku: '', color: '', storage: '', price: '' }])}
              >
                Thêm phân loại
              </Button>
            </Box>

            {/* Vòng lặp vẽ các dòng nhập liệu biến thể */}
            {addVariants.map((variant) => (
              <Grid container spacing={1.5} alignItems="center" sx={{ mb: 1.5 }} key={variant.id}>
                <Grid item xs={3}>
                  <TextField
                    fullWidth size="small" label="Mã SKU *" placeholder="VD: IP15-256-DEN"
                    value={variant.sku}
                    onChange={(e) => setAddVariants(addVariants.map(v => v.id === variant.id ? { ...v, sku: e.target.value } : v))}
                  />
                </Grid>
                <Grid item xs={2.5}>
                  <TextField
                    fullWidth size="small" label="Màu sắc *" placeholder="VD: Đen Titan"
                    value={variant.color}
                    onChange={(e) => setAddVariants(addVariants.map(v => v.id === variant.id ? { ...v, color: e.target.value } : v))}
                  />
                </Grid>
                <Grid item xs={2.5}>
                  <TextField
                    fullWidth size="small" label="Dung lượng *" placeholder="VD: 256GB"
                    value={variant.storage}
                    onChange={(e) => setAddVariants(addVariants.map(v => v.id === variant.id ? { ...v, storage: e.target.value } : v))}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth size="small" label="Giá bán riêng" type="number"
                    value={variant.price}
                    onChange={(e) => setAddVariants(addVariants.map(v => v.id === variant.id ? { ...v, price: e.target.value } : v))}
                  />
                </Grid>
                <Grid item xs={1} textAlign="center">
                  <IconButton
                    color="error"
                    disabled={addVariants.length === 1} // Không cho xóa nếu chỉ còn 1 dòng
                    onClick={() => setAddVariants(addVariants.filter(v => v.id !== variant.id))}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Box>

        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAddModal}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleSubmitAdd}>Lưu Sản Phẩm</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG XÓA */}
      <Dialog open={Boolean(deleteConfirmId)} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle color="error">Xác nhận xóa</DialogTitle>
        <DialogContent><Typography>Xóa sản phẩm này chứ?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>Xóa ngay</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Product