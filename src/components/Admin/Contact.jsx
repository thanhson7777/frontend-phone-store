import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, CircularProgress,
  Chip, Tabs, Tab, Divider, Avatar
} from '@mui/material'

// Icons
import ContactPhoneIcon from '@mui/icons-material/ContactPhone'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import SaveIcon from '@mui/icons-material/Save'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SendIcon from '@mui/icons-material/Send'
import ChatIcon from '@mui/icons-material/Chat'

// Thư viện ngoài
import { toast } from 'react-toastify'

// API
import {
  fetchAdminContactInfoAPI,
  updateAdminContactInfoAPI,
  fetchAdminContactMessagesAPI,
  replyContactMessageAPI,
  deleteContactMessageAPI
} from '~/apis'

// Bản ghi mặc định khi DB chưa có contact_info (lần đầu vào admin)
const EMPTY_CONTACT_INFO = {
  storeName: '',
  email: '',
  phone: '',
  address: '',
  workingHours: { weekday: '', weekend: '' },
  socialLinks: { facebook: '', zalo: '', youtube: '' },
  mapEmbed: ''
}

// Format ngày
const formatDateTime = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function Contact() {
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)

  // Contact Info State
  const [contactInfo, setContactInfo] = useState(null)
  const [editInfo, setEditInfo] = useState(null)
  const [isEditingInfo, setIsEditingInfo] = useState(false)

  // Messages State
  const [messages, setMessages] = useState([])
  const [replyDialog, setReplyDialog] = useState({ open: false, message: null })
  const [replyText, setReplyText] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  // ==========================================
  // 1. TẢI DỮ LIỆU
  // ==========================================
  const loadData = async () => {
    try {
      setLoading(true)
      const [infoRes, messagesRes] = await Promise.all([
        fetchAdminContactInfoAPI(),
        fetchAdminContactMessagesAPI()
      ])
      setContactInfo(infoRes)
      setEditInfo(infoRes)
      setMessages(Array.isArray(messagesRes) ? messagesRes : [])
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  // ==========================================
  // 2. CẬP NHẬT THÔNG TIN LIÊN HỆ
  // ==========================================
  const handleSaveInfo = async () => {
    try {
      await toast.promise(
        updateAdminContactInfoAPI(editInfo),
        { pending: 'Đang lưu...', success: 'Lưu thành công!', error: 'Lưu thất bại!' }
      )
      setIsEditingInfo(false)
      loadData()
    } catch (error) { console.error(error) }
  }

  const handleCancelEditInfo = () => {
    setEditInfo(contactInfo)
    setIsEditingInfo(false)
  }

  // ==========================================
  // 3. TRẢ LỜI TIN NHẮN
  // ==========================================
  const handleOpenReply = (message) => {
    setReplyDialog({ open: true, message })
    setReplyText('')
  }

  const handleCloseReply = () => {
    setReplyDialog({ open: false, message: null })
    setReplyText('')
  }

  const handleSendReply = async () => {
    if (!replyText.trim()) return toast.error('Vui lòng nhập nội dung trả lời!')
    try {
      await toast.promise(
        replyContactMessageAPI(replyDialog.message._id, { repliedMessage: replyText }),
        { pending: 'Đang gửi...', success: 'Gửi trả lời thành công!', error: 'Gửi thất bại!' }
      )
      handleCloseReply()
      loadData()
    } catch (error) { console.error(error) }
  }

  // ==========================================
  // 4. XÓA TIN NHẮN
  // ==========================================
  const confirmDelete = async () => {
    try {
      await toast.promise(
        deleteContactMessageAPI(deleteConfirmId),
        { pending: 'Đang xóa...', success: 'Xóa thành công!', error: 'Xóa thất bại!' }
      )
      setDeleteConfirmId(null)
      loadData()
    } catch (error) { console.error(error) }
  }

  // ==========================================
  // 5. RENDER
  // ==========================================
  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 10 }} />

  const unrepliedCount = messages.filter(m => !m.isReplied).length

  return (
    <Box sx={{ pb: 5 }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ContactPhoneIcon color="error" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">Quản lý Liên hệ</Typography>
        </Box>
      </Box>

      {/* TABS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Thông tin cửa hàng" />
          <Tab label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Tin nhắn liên hệ
              {unrepliedCount > 0 && (
                <Chip label={unrepliedCount} color="error" size="small" />
              )}
            </Box>
          } />
        </Tabs>
      </Box>

      {/* TAB 1: THÔNG TIN CỬA HÀNG */}
      {tab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Thông tin liên hệ</Typography>
            {!isEditingInfo ? (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => {
                  if (!editInfo) setEditInfo({ ...EMPTY_CONTACT_INFO })
                  setIsEditingInfo(true)
                }}
              >
                Chỉnh sửa
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" color="inherit" onClick={handleCancelEditInfo}>Hủy</Button>
                <Button variant="contained" color="error" startIcon={<SaveIcon />} onClick={handleSaveInfo}>
                  Lưu thay đổi
                </Button>
              </Box>
            )}
          </Box>

          {editInfo ? (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth label="Tên cửa hàng"
                    value={editInfo.storeName || ''}
                    onChange={e => setEditInfo({ ...editInfo, storeName: e.target.value })}
                    disabled={!isEditingInfo}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth label="Email"
                    value={editInfo.email || ''}
                    onChange={e => setEditInfo({ ...editInfo, email: e.target.value })}
                    disabled={!isEditingInfo}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth label="Số điện thoại"
                    value={editInfo.phone || ''}
                    onChange={e => setEditInfo({ ...editInfo, phone: e.target.value })}
                    disabled={!isEditingInfo}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Địa chỉ"
                    value={editInfo.address || ''}
                    onChange={e => setEditInfo({ ...editInfo, address: e.target.value })}
                    disabled={!isEditingInfo}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth label="Giờ làm việc (ngày thường)"
                    value={editInfo.workingHours?.weekday || ''}
                    onChange={e => setEditInfo({ ...editInfo, workingHours: { ...editInfo.workingHours, weekday: e.target.value } })}
                    disabled={!isEditingInfo}
                    placeholder="VD: 8:00 - 21:00"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth label="Giờ làm việc (cuối tuần)"
                    value={editInfo.workingHours?.weekend || ''}
                    onChange={e => setEditInfo({ ...editInfo, workingHours: { ...editInfo.workingHours, weekend: e.target.value } })}
                    disabled={!isEditingInfo}
                    placeholder="VD: 9:00 - 20:00"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth label="Facebook"
                    value={editInfo.socialLinks?.facebook || ''}
                    onChange={e => setEditInfo({ ...editInfo, socialLinks: { ...editInfo.socialLinks, facebook: e.target.value } })}
                    disabled={!isEditingInfo}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth label="Zalo"
                    value={editInfo.socialLinks?.zalo || ''}
                    onChange={e => setEditInfo({ ...editInfo, socialLinks: { ...editInfo.socialLinks, zalo: e.target.value } })}
                    disabled={!isEditingInfo}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth label="Youtube"
                    value={editInfo.socialLinks?.youtube || ''}
                    onChange={e => setEditInfo({ ...editInfo, socialLinks: { ...editInfo.socialLinks, youtube: e.target.value } })}
                    disabled={!isEditingInfo}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Google Maps Embed URL"
                    value={editInfo.mapEmbed || ''}
                    onChange={e => setEditInfo({ ...editInfo, mapEmbed: e.target.value })}
                    disabled={!isEditingInfo}
                    multiline
                    rows={2}
                    placeholder="iframe src='...'"
                  />
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">Chưa có thông tin liên hệ. Nhấn "Chỉnh sửa" để thêm mới.</Typography>
            </Paper>
          )}
        </Box>
      )}

      {/* TAB 2: TIN NHẮN LIÊN HỆ */}
      {tab === 1 && (
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Danh sách tin nhắn ({messages.length})
          </Typography>

          {messages.length === 0 ? (
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
              <ChatIcon sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
              <Typography color="text.secondary">Chưa có tin nhắn nào.</Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Người gửi</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Liên hệ</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nội dung</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Ngày gửi</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {messages.map((msg) => (
                    <TableRow key={msg._id} hover>
                      <TableCell>
                        <Typography fontWeight="bold">{msg.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="body2">{msg.email}</Typography>
                          </Box>
                          {msg.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="body2">{msg.phone}</Typography>
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {msg.subject && (
                          <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>{msg.subject}</Typography>
                        )}
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {msg.message}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDateTime(msg.createdAt)}</Typography>
                      </TableCell>
                      <TableCell>
                        {msg.isReplied ? (
                          <Chip label="Đã trả lời" color="success" size="small" />
                        ) : (
                          <Chip label="Chưa trả lời" color="warning" size="small" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {!msg.isReplied && (
                          <Button size="small" startIcon={<SendIcon />} onClick={() => handleOpenReply(msg)} sx={{ mr: 1 }}>
                            Trả lời
                          </Button>
                        )}
                        <IconButton color="error" size="small" onClick={() => setDeleteConfirmId(msg._id)}>
                          <DeleteOutlineIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* DIALOG TRẢ LỜI */}
      <Dialog open={replyDialog.open} onClose={handleCloseReply} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Trả lời tin nhắn</DialogTitle>
        <DialogContent dividers>
          {replyDialog.message && (
            <Box>
              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Tin nhắn từ: <strong>{replyDialog.message.name}</strong> ({replyDialog.message.email})</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{replyDialog.message.message}</Typography>
              </Box>
              <TextField
                fullWidth
                label="Nội dung trả lời"
                multiline
                rows={4}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Nhập nội dung trả lời..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseReply}>Hủy</Button>
          <Button variant="contained" color="error" startIcon={<SendIcon />} onClick={handleSendReply}>
            Gửi trả lời
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG XÓA */}
      <Dialog open={Boolean(deleteConfirmId)} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle color="error">Xác nhận xóa</DialogTitle>
        <DialogContent><Typography>Bạn có chắc chắn muốn xóa tin nhắn này?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>Xóa ngay</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Contact
