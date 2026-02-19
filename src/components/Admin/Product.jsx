import { useState } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Collapse, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, Avatar
} from '@mui/material'

// Icons
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import SaveIcon from '@mui/icons-material/Save'

// Dữ liệu giả lập (Mock Data)
const initialProducts = [
  { _id: 'P1', name: 'iPhone 15 Pro Max', brand: 'Apple', price: 29000000, stock: 45, image: 'https://via.placeholder.com/50' },
  { _id: 'P2', name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', price: 31000000, stock: 20, image: 'https://via.placeholder.com/50' },
  { _id: 'P3', name: 'Xiaomi 14 Pro', brand: 'Xiaomi', price: 18000000, stock: 0, image: 'https://via.placeholder.com/50' },
]

// Hàm format tiền tệ
const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)

function Product() {
  const [products, setProducts] = useState(initialProducts)

  // State cho Modal Thêm Mới
  const [openAddModal, setOpenAddModal] = useState(false)

  // State cho Popup Xóa
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // State lưu ID của dòng đang được mở rộng (trượt xuống) để Sửa
  // Dùng chuỗi ID thay vì boolean để đảm bảo tại 1 thời điểm chỉ mở 1 dòng cho đỡ rối
  const [expandedRowId, setExpandedRowId] = useState(null)

  // ==========================================
  // HÀM XỬ LÝ SỰ KIỆN
  // ==========================================
  const handleToggleExpand = (id) => {
    // Nếu bấm lại dòng đang mở thì đóng nó, nếu bấm dòng khác thì mở dòng đó
    setExpandedRowId(expandedRowId === id ? null : id)
  }

  const handleDeleteClick = (e, id) => {
    e.stopPropagation() // Ngăn không cho sự kiện click lan ra dòng (tránh mở khung trượt)
    setDeleteConfirmId(id)
  }

  const confirmDelete = () => {
    setProducts(products.filter(p => p._id !== deleteConfirmId))
    setDeleteConfirmId(null)
  }

  // Dành cho Modal Thêm Mới: Quản lý danh sách biến thể trong Modal
  const [addVariants, setAddVariants] = useState([
    { id: Date.now(), sku: '', color: '', storage: '', price: '' }
  ])

  const handleAddModalVariant = () => {
    setAddVariants([...addVariants, { id: Date.now(), sku: '', color: '', storage: '', price: '' }])
  }

  const handleRemoveModalVariant = (idToRemove) => {
    setAddVariants(addVariants.filter(v => v.id !== idToRemove))
  }

  const handleModalVariantChange = (id, field, value) => {
    setAddVariants(addVariants.map(v =>
      v.id === id ? { ...v, [field]: value } : v
    ))
  }

  // Nâng cao: Reset lại form trống trơn mỗi khi đóng Modal
  const handleCloseAddModal = () => {
    setOpenAddModal(false)
    setAddVariants([{ id: Date.now(), sku: '', color: '', storage: '', price: '' }])
  }

  // Component riêng lẻ vẽ từng dòng dữ liệu (Row) để chứa cái <Collapse> trượt
  const ProductRow = ({ row }) => {
    const isExpanded = expandedRowId === row._id

    // 🌟 STATE QUẢN LÝ DANH SÁCH BIẾN THỂ CỦA SẢN PHẨM NÀY
    // Giả sử row.variants là mảng data từ Backend truyền vào
    const [variants, setVariants] = useState(row.variants || [
      { id: Date.now(), sku: '', color: '', storage: '', price: '' } // Dòng mặc định nếu chưa có
    ])

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
        {/* DÒNG HIỂN THỊ CHÍNH */}
        <TableRow
          hover
          onClick={() => handleToggleExpand(row._id)} // Click vào dòng là mở/đóng
          sx={{ cursor: 'pointer', '& > *': { borderBottom: 'unset' } }}
        >
          <TableCell>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleToggleExpand(row._id); }}>
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar variant="rounded" src={row.image} alt={row.name} />
              <Typography fontWeight="bold">{row.name}</Typography>
            </Box>
          </TableCell>
          <TableCell>{row.brand}</TableCell>
          <TableCell sx={{ color: 'error.main', fontWeight: 'bold' }}>{formatPrice(row.price)}</TableCell>
          <TableCell>
            {row.stock > 0 ? <Typography color="success.main">{row.stock} cái</Typography> : <Typography color="error.main">Hết hàng</Typography>}
          </TableCell>
          <TableCell align="right">
            <IconButton
              color="error"
              onClick={(e) => handleDeleteClick(e, row._id)} // Nút Xóa hiện ở ngoài
            >
              <DeleteOutlineIcon />
            </IconButton>
          </TableCell>
        </TableRow>

        {/* DÒNG TRƯỢT XUỐNG ĐỂ SỬA (COLLAPSE) */}
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 3, my: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Cập nhật thông tin: {row.name}
                </Typography>

                {/* 1. THÔNG TIN CHUNG */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Tên sản phẩm" defaultValue={row.name} size="small" /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Thương hiệu" defaultValue={row.brand} size="small" /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Giá bán (Mặc định)" defaultValue={row.price} size="small" type="number" /></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Tổng tồn kho" defaultValue={row.stock} size="small" type="number" /></Grid>
                </Grid>

                {/* 2. KHU VỰC QUẢN LÝ BIẾN THỂ (VARIANTS) 🌟 */}
                <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Phân loại hàng (Biến thể)</Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={handleAddVariant}
                    >
                      Thêm phân loại
                    </Button>
                  </Box>

                  {/* Vòng lặp in ra các dòng biến thể */}
                  {variants.map((variant, index) => (
                    <Grid container spacing={1.5} alignItems="center" sx={{ mb: 1.5 }} key={variant.id}>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth size="small" label="Mã SKU" placeholder="VD: IP15-256-DEN"
                          value={variant.sku} onChange={(e) => handleVariantChange(variant.id, 'sku', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={2.5}>
                        <TextField
                          fullWidth size="small" label="Màu sắc" placeholder="VD: Đen Titan"
                          value={variant.color} onChange={(e) => handleVariantChange(variant.id, 'color', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={2.5}>
                        <TextField
                          fullWidth size="small" label="Dung lượng" placeholder="VD: 256GB"
                          value={variant.storage} onChange={(e) => handleVariantChange(variant.id, 'storage', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth size="small" label="Giá bán riêng" type="number"
                          value={variant.price} onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={1} textAlign="center">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveVariant(variant.id)}
                          disabled={variants.length === 1} // Không cho xóa nếu chỉ còn 1 dòng
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </Box>

                {/* NÚT LƯU CỦA TOÀN BỘ FORM */}
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
      {/* 1. KHU VỰC HEADER & NÚT THÊM MỚI */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="#1e293b">
          Quản lý Sản phẩm
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
          sx={{ fontWeight: 'bold', px: 3 }}
        >
          Thêm Sản Phẩm Mới
        </Button>
      </Box>

      {/* 2. BẢNG DANH SÁCH SẢN PHẨM */}
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell width="50px" />
              <TableCell sx={{ fontWeight: 'bold' }}>Sản Phẩm</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Thương Hiệu</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Giá Bán</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tồn Kho</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((row) => (
              <ProductRow key={row._id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ========================================== */}
      {/* 3. MODAL THÊM SẢN PHẨM MỚI */}
      {/* ========================================== */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Thêm Sản Phẩm Mới</DialogTitle>
        <DialogContent dividers>

          <Grid container spacing={3} sx={{ mt: 0.5, mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Tên sản phẩm" placeholder="VD: iPhone 16 Pro" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Thương hiệu" placeholder="VD: Apple" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Mô tả" multiline rows={4} placeholder="Nhập mô tả..." />
            </Grid>
          </Grid>

          {/* 2. KHU VỰC QUẢN LÝ BIẾN THỂ (VARIANTS) 🌟 */}
          <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Phân loại hàng (Biến thể)</Typography>
              <Button
                variant="outlined" color="primary" size="small" startIcon={<AddIcon />}
                onClick={handleAddModalVariant} // 🌟 Đổi tên hàm ở đây
              >
                Thêm phân loại
              </Button>
            </Box>

            {/* 🌟 Vòng lặp in ra biến addVariants */}
            {addVariants.map((variant, index) => (
              <Grid container spacing={1.5} alignItems="center" sx={{ mb: 1.5 }} key={variant.id}>
                <Grid item xs={3}>
                  <TextField
                    fullWidth size="small" label="Mã SKU" placeholder="VD: IP15-256-DEN"
                    value={variant.sku}
                    onChange={(e) => handleModalVariantChange(variant.id, 'sku', e.target.value)} // 🌟 Đổi tên hàm
                  />
                </Grid>
                <Grid item xs={2.5}>
                  <TextField
                    fullWidth size="small" label="Màu sắc" placeholder="VD: Đen Titan"
                    value={variant.color}
                    onChange={(e) => handleModalVariantChange(variant.id, 'color', e.target.value)} // 🌟 Đổi tên hàm
                  />
                </Grid>
                <Grid item xs={2.5}>
                  <TextField
                    fullWidth size="small" label="Dung lượng" placeholder="VD: 256GB"
                    value={variant.storage}
                    onChange={(e) => handleModalVariantChange(variant.id, 'storage', e.target.value)} // 🌟 Đổi tên hàm
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth size="small" label="Giá bán riêng" type="number"
                    value={variant.price}
                    onChange={(e) => handleModalVariantChange(variant.id, 'price', e.target.value)} // 🌟 Đổi tên hàm
                  />
                </Grid>
                <Grid item xs={1} textAlign="center">
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveModalVariant(variant.id)} // 🌟 Đổi tên hàm
                    disabled={addVariants.length === 1}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAddModal} color="inherit">Hủy bỏ</Button>
          <Button variant="contained" color="error">Lưu Sản Phẩm</Button>
        </DialogActions>
      </Dialog>

      {/* ========================================== */}
      {/* 4. POPUP XÁC NHẬN XÓA */}
      {/* ========================================== */}
      <Dialog open={Boolean(deleteConfirmId)} onClose={() => setDeleteConfirmId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'error.main' }}>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống không? Hành động này không thể hoàn tác.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)} color="inherit">Hủy</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">Xóa ngay</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Product