import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Collapse, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, Avatar, CircularProgress,
  Switch, Select, MenuItem, FormControl, InputLabel, Chip, InputAdornment
} from '@mui/material'

// Icons
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import SaveIcon from '@mui/icons-material/Save'
import ArticleIcon from '@mui/icons-material/Article'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// Thư viện ngoài
import { toast } from 'react-toastify'

// API
import {
  fetchAdminArticlesAPI,
  createAdminArticleAPI,
  updateAdminArticleAPI,
  deleteAdminArticleAPI
} from '~/apis'

// Format ngày
const formatDate = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Category labels
const CATEGORY_LABELS = {
  news: { label: 'Tin tức', color: 'info' },
  review: { label: 'Review', color: 'warning' },
  guide: { label: 'Hướng dẫn', color: 'success' },
  tips: { label: 'Tips', color: 'secondary' }
}

function Article() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const [openAddModal, setOpenAddModal] = useState(false)
  const [expandedRowId, setExpandedRowId] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // ==========================================
  // 1. TẢI DỮ LIỆU
  // ==========================================
  const loadData = async () => {
    try {
      setLoading(true)
      const res = await fetchAdminArticlesAPI()
      if (Array.isArray(res)) setArticles(res)
      else setArticles([])
    } catch (error) {
      console.error('Lỗi lấy bài viết:', error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchFilter = filter === 'all' || article.category === filter
    const matchSearch = article.title.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  // ==========================================
  // 2. THÊM MỚI (MODAL)
  // ==========================================
  const [addData, setAddData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'news',
    tags: '',
    isFeatured: false,
    isPublished: false
  })
  const [thumbFile, setThumbFile] = useState(null)
  const [thumbPreview, setThumbPreview] = useState(null)

  const handleCloseAddModal = () => {
    setOpenAddModal(false)
    setAddData({ title: '', excerpt: '', content: '', category: 'news', tags: '', isFeatured: false, isPublished: false })
    setThumbFile(null)
    setThumbPreview(null)
  }

  const handleAddSubmit = async () => {
    if (!addData.title.trim()) return toast.error('Vui lòng nhập tiêu đề!')
    if (!addData.content.trim()) return toast.error('Vui lòng nhập nội dung!')

    const formData = new FormData()
    formData.append('title', addData.title)
    formData.append('excerpt', addData.excerpt)
    formData.append('content', addData.content)
    formData.append('category', addData.category)
    formData.append('tags', addData.tags)
    formData.append('isFeatured', addData.isFeatured)
    formData.append('isPublished', addData.isPublished)
    if (thumbFile) formData.append('thumbnail', thumbFile)

    try {
      await toast.promise(
        createAdminArticleAPI(formData),
        { pending: 'Đang tạo bài viết...', success: 'Thêm bài viết thành công!', error: 'Thêm thất bại!' }
      )
      handleCloseAddModal()
      loadData()
    } catch (error) { console.error(error) }
  }

  // ==========================================
  // 3. XÓA
  // ==========================================
  const confirmDelete = async () => {
    try {
      await toast.promise(
        deleteAdminArticleAPI(deleteConfirmId),
        { pending: 'Đang xóa...', success: 'Xóa thành công!', error: 'Xóa thất bại!' }
      )
      setDeleteConfirmId(null)
      loadData()
    } catch (error) { console.error(error) }
  }

  // ==========================================
  // 4. COMPONENT DÒNG DỮ LIỆU
  // ==========================================
  const ArticleRow = ({ row }) => {
    const isExpanded = expandedRowId === row._id
    const categoryInfo = CATEGORY_LABELS[row.category] || { label: row.category, color: 'default' }

    // Form sửa
    const [editData, setEditData] = useState({
      title: row.title,
      excerpt: row.excerpt || '',
      content: row.content || '',
      category: row.category || 'news',
      tags: row.tags?.join(', ') || '',
      isFeatured: row.isFeatured || false,
      isPublished: row.isPublished || false
    })
    const [editThumbFile, setEditThumbFile] = useState(null)
    const [editThumbPreview, setEditThumbPreview] = useState(row.thumbnail)

    const handleUpdateSubmit = async () => {
      const formData = new FormData()
      formData.append('title', editData.title)
      formData.append('excerpt', editData.excerpt)
      formData.append('content', editData.content)
      formData.append('category', editData.category)
      formData.append('tags', editData.tags)
      formData.append('isFeatured', editData.isFeatured)
      formData.append('isPublished', editData.isPublished)
      if (editThumbFile) formData.append('thumbnail', editThumbFile)

      try {
        await toast.promise(
          updateAdminArticleAPI(row._id, formData),
          { pending: 'Đang cập nhật...', success: 'Cập nhật thành công!', error: 'Lỗi cập nhật!' }
        )
        setExpandedRowId(null)
        loadData()
      } catch (error) { console.error(error) }
    }

    // Toggle published
    const handleTogglePublished = async (e) => {
      e.stopPropagation()
      try {
        await updateAdminArticleAPI(row._id, { isPublished: e.target.checked })
        loadData()
      } catch (error) { toast.error('Không thể đổi trạng thái') }
    }

    return (
      <>
        {/* DÒNG HIỂN THỊ */}
        <TableRow hover onClick={() => setExpandedRowId(isExpanded ? null : row._id)} sx={{ cursor: 'pointer', '& > *': { borderBottom: 'unset' } }}>
          <TableCell width="50px">
            <IconButton size="small">
              <KeyboardArrowDownIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
            </IconButton>
          </TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar variant="rounded" src={row.thumbnail} sx={{ width: 60, height: 40, bgcolor: 'grey.200' }}>
                <ArticleIcon />
              </Avatar>
              <Box>
                <Typography fontWeight="bold" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.title}
                </Typography>
                {row.isFeatured && <Chip label="Nổi bật" size="small" color="warning" sx={{ mt: 0.5, height: 18, fontSize: 10 }} />}
              </Box>
            </Box>
          </TableCell>
          <TableCell>
            <Chip label={categoryInfo.label} color={categoryInfo.color} size="small" />
          </TableCell>
          <TableCell>
            <Typography variant="body2" color="text.secondary">
              {formatDate(row.publishedAt || row.createdAt)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              👁 {row.viewCount || 0} lượt xem
            </Typography>
          </TableCell>
          <TableCell onClick={(e) => e.stopPropagation()}>
            <Switch color="success" checked={row.isPublished} onChange={handleTogglePublished} />
          </TableCell>
          <TableCell align="right">
            <IconButton color="error" onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(row._id) }}>
              <DeleteOutlineIcon />
            </IconButton>
          </TableCell>
        </TableRow>

        {/* THANH TRƯỢT SỬA */}
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ p: 3, my: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px dashed #cbd5e1' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Chỉnh sửa: {row.title}</Typography>
                <Grid container spacing={3}>
                  {/* Thumbnail */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ border: '1px dashed #94a3b8', borderRadius: 2, p: 2, textAlign: 'center', bgcolor: '#fff' }}>
                      <Avatar src={editThumbPreview} variant="rounded" sx={{ width: '100%', height: 120, mb: 2, objectFit: 'cover' }} />
                      <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} size="small">
                        Đổi Ảnh
                        <input type="file" hidden accept="image/*" onChange={(e) => {
                          if (e.target.files[0]) {
                            setEditThumbFile(e.target.files[0])
                            setEditThumbPreview(URL.createObjectURL(e.target.files[0]))
                          }
                        }} />
                      </Button>
                    </Box>
                  </Grid>

                  {/* Form */}
                  <Grid item xs={12} md={9}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Tiêu đề *" value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} size="small" />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Danh mục</InputLabel>
                          <Select value={editData.category} label="Danh mục" onChange={e => setEditData({ ...editData, category: e.target.value })}>
                            <MenuItem value="news">Tin tức</MenuItem>
                            <MenuItem value="review">Review</MenuItem>
                            <MenuItem value="guide">Hướng dẫn</MenuItem>
                            <MenuItem value="tips">Tips</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Tags (phân cách bằng dấu phẩy)" value={editData.tags} onChange={e => setEditData({ ...editData, tags: e.target.value })} size="small" />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Mô tả ngắn" value={editData.excerpt} onChange={e => setEditData({ ...editData, excerpt: e.target.value })} size="small" multiline rows={2} />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Nội dung *" value={editData.content} onChange={e => setEditData({ ...editData, content: e.target.value })} size="small" multiline rows={4} />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Switch checked={editData.isPublished} onChange={(e) => setEditData({ ...editData, isPublished: e.target.checked })} />
                          <Typography variant="body2">Xuất bản</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Switch checked={editData.isFeatured} onChange={(e) => setEditData({ ...editData, isFeatured: e.target.checked })} />
                          <Typography variant="body2">Nổi bật</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="outlined" color="inherit" onClick={() => setExpandedRowId(null)}>Hủy</Button>
                        <Button variant="contained" color="error" startIcon={<SaveIcon />} onClick={handleUpdateSubmit}>Lưu thay đổi</Button>
                      </Box>
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
          <ArticleIcon color="error" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">Quản lý Bài viết</Typography>
        </Box>
        <Button variant="contained" color="error" startIcon={<AddIcon />} onClick={() => setOpenAddModal(true)}>Viết bài mới</Button>
      </Box>

      {/* FILTER & SEARCH */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Lọc theo danh mục</InputLabel>
          <Select value={filter} label="Lọc theo danh mục" onChange={e => setFilter(e.target.value)}>
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="news">Tin tức</MenuItem>
            <MenuItem value="review">Review</MenuItem>
            <MenuItem value="guide">Hướng dẫn</MenuItem>
            <MenuItem value="tips">Tips</MenuItem>
          </Select>
        </FormControl>
        <TextField size="small" placeholder="Tìm kiếm bài viết..." value={search} onChange={e => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} sx={{ flexGrow: 1 }} />
      </Box>

      {/* BẢNG BÀI VIẾT */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell width="50px" />
              <TableCell sx={{ fontWeight: 'bold' }}>Bài viết</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Danh mục</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày đăng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredArticles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Không có bài viết nào.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredArticles.map((row) => <ArticleRow key={row._id} row={row} />)
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL THÊM MỚI */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="md" fullWidth>
        <DialogTitle fontWeight="bold">Viết bài mới</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ border: '1px dashed #94a3b8', borderRadius: 2, p: 2, textAlign: 'center', mb: 3 }}>
            {thumbPreview ? (
              <Avatar src={thumbPreview} variant="rounded" sx={{ width: '100%', height: 200, mb: 2, objectFit: 'cover' }} />
            ) : (
              <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f1f5f9', mb: 2, borderRadius: 2 }}>
                <Typography color="text.secondary">Chưa chọn ảnh thumbnail</Typography>
              </Box>
            )}
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
              Tải ảnh thumbnail
              <input type="file" hidden accept="image/*" onChange={(e) => {
                if (e.target.files[0]) {
                  setThumbFile(e.target.files[0])
                  setThumbPreview(URL.createObjectURL(e.target.files[0]))
                }
              }} />
            </Button>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Tiêu đề *" value={addData.title} onChange={e => setAddData({ ...addData, title: e.target.value })} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Danh mục</InputLabel>
                <Select value={addData.category} label="Danh mục" onChange={e => setAddData({ ...addData, category: e.target.value })}>
                  <MenuItem value="news">Tin tức</MenuItem>
                  <MenuItem value="review">Review</MenuItem>
                  <MenuItem value="guide">Hướng dẫn</MenuItem>
                  <MenuItem value="tips">Tips</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Tags (phân cách bằng dấu phẩy)" value={addData.tags} onChange={e => setAddData({ ...addData, tags: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Mô tả ngắn" value={addData.excerpt} onChange={e => setAddData({ ...addData, excerpt: e.target.value })} multiline rows={2} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Nội dung *" value={addData.content} onChange={e => setAddData({ ...addData, content: e.target.value })} multiline rows={6} />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Switch checked={addData.isPublished} onChange={(e) => setAddData({ ...addData, isPublished: e.target.checked })} />
                  <Typography>Xuất bản ngay</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Switch checked={addData.isFeatured} onChange={(e) => setAddData({ ...addData, isFeatured: e.target.checked })} />
                  <Typography>Bài nổi bật</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAddModal}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleAddSubmit}>Đăng bài</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG XÓA */}
      <Dialog open={Boolean(deleteConfirmId)} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle color="error">Xác nhận xóa</DialogTitle>
        <DialogContent><Typography>Bạn có chắc chắn muốn xóa bài viết này?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>Xóa ngay</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Article
