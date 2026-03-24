import { useState } from 'react'
import {
  Box, Container, Typography, Grid, TextField, Button,
  Card, CardContent, Breadcrumbs, Link, Snackbar, Alert,
  Accordion, AccordionSummary, AccordionDetails, MenuItem
} from '@mui/material'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SendIcon from '@mui/icons-material/Send'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { submitContactMessageAPI } from '~/apis'

// Contact info cards
const contactInfo = [
  {
    icon: <PhoneIcon sx={{ fontSize: 32 }} />,
    title: 'Điện thoại',
    content: '1900-1234',
    subtitle: 'Tư vấn 24/7'
  },
  {
    icon: <EmailIcon sx={{ fontSize: 32 }} />,
    title: 'Email',
    content: 'contact@phonestore.vn',
    subtitle: 'Phản hồi trong 24h'
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: 32 }} />,
    title: 'Địa chỉ',
    content: '123 Nguyễn Trãi, Q.1',
    subtitle: 'TP. Hồ Chí Minh'
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 32 }} />,
    title: 'Giờ làm việc',
    content: '8:00 - 22:00',
    subtitle: 'Tất cả các ngày'
  }
]

// Subject options
const subjectOptions = [
  { value: 'purchase', label: 'Mua hàng' },
  { value: 'warranty', label: 'Bảo hành' },
  { value: 'payment', label: 'Thanh toán' },
  { value: 'shipping', label: 'Giao hàng' },
  { value: 'return', label: 'Đổi trả' },
  { value: 'other', label: 'Khác' }
]

// FAQ data
const faqData = [
  {
    question: 'Làm sao để đặt hàng online?',
    answer: 'Bạn có thể đặt hàng trực tiếp trên website bằng cách chọn sản phẩm, thêm vào giỏ hàng và tiến hành thanh toán. Đội ngũ tư vấn sẽ liên hệ xác nhận đơn hàng trong vòng 5 phút.'
  },
  {
    question: 'Chính sách bảo hành như thế nào?',
    answer: 'Tất cả sản phẩm được bảo hành chính hãng từ 12-24 tháng tùy sản phẩm. Quý khách có thể mang sản phẩm đến bất kỳ trung tâm bảo hành nào của hãng hoặc liên hệ với chúng tôi để được hỗ trợ.'
  },
  {
    question: 'Thời gian giao hàng bao lâu?',
    answer: 'Nội thành TP.HCM và Hà Nội: 1-2 ngày. Các tỉnh thành khác: 2-4 ngày. Đơn hàng được xác nhận trước 17h sẽ được giao trong ngày (nội thành).'
  },
  {
    question: 'Có hỗ trợ trả góp không?',
    answer: 'Chúng tôi hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng với thời hạn 3-6 tháng. Ngoài ra, bạn có thể trả góp qua các công ty tài chính với lãi suất ưu đãi.'
  },
  {
    question: 'Làm sao để kiểm tra tình trạng đơn hàng?',
    answer: 'Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản, vào mục "Đơn hàng của tôi" hoặc liên hệ trực tiếp qua hotline 1900-1234 để được hỗ trợ.'
  },
  {
    question: 'Chính sách đổi trả như thế nào?',
    answer: 'Quý khách được đổi trả trong vòng 7 ngày nếu sản phẩm bị lỗi từ nhà sản xuất, không áp dụng cho trường hợp lỗi do người sử dụng. Sản phẩm đổi trả phải còn nguyên seal và phụ kiện đi kèm.'
  }
]

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSnackbar({
        open: true,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc!',
        severity: 'error'
      })
      return
    }

    if (!formData.email.includes('@')) {
      setSnackbar({
        open: true,
        message: 'Email không hợp lệ!',
        severity: 'error'
      })
      return
    }

    if (formData.message.trim().length < 10) {
      setSnackbar({
        open: true,
        message: 'Nội dung tin nhắn cần ít nhất 10 ký tự!',
        severity: 'error'
      })
      return
    }

    setLoading(true)

    const subjectLabel =
      subjectOptions.find((o) => o.value === formData.subject)?.label ||
      formData.subject

    try {
      await submitContactMessageAPI({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: subjectLabel,
        message: formData.message.trim()
      })
      setSnackbar({
        open: true,
        message: 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi trong 24h.',
        severity: 'success'
      })
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0] ||
        err?.message
      setSnackbar({
        open: true,
        message:
          typeof apiMsg === 'string'
            ? apiMsg
            : 'Gửi tin nhắn thất bại. Vui lòng thử lại sau.',
        severity: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
          color: 'white',
          py: 6,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
            Liên Hệ Với Chúng Tôi
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link component="a" href="/" color="inherit" underline="hover">
            Trang chủ
          </Link>
          <Typography color="text.primary">Liên hệ</Typography>
        </Breadcrumbs>

        {/* Contact Info Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {contactInfo.map((item, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ color: 'error.main', mb: 2 }}>{item.icon}</Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {item.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                Gửi Tin Nhắn
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Họ và tên *"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Chủ đề *"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      {subjectOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nội dung tin nhắn *"
                      name="message"
                      multiline
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Viết nội dung tin nhắn của bạn tại đây..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={loading}
                      endIcon={loading ? null : <SendIcon />}
                      sx={{
                        bgcolor: 'error.main',
                        py: 1.5,
                        '&:hover': { bgcolor: 'error.dark' }
                      }}
                    >
                      {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>

          {/* Map */}
          <Grid item xs={12} md={5}>
            <Card sx={{ height: '100%', minHeight: 400 }}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  minHeight: 400,
                  bgcolor: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <LocationOnIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    Phone Store
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    123 Nguyễn Trãi, Phường Bến Thành
                    <br />
                    Quận 1, TP. Hồ Chí Minh
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    href="https://maps.google.com"
                    target="_blank"
                  >
                    Mở trên Google Maps
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* FAQ Section */}
        <Box sx={{ mt: 6 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              textAlign: 'center',
              mb: 4,
              borderBottom: '4px solid #d32f2f',
              display: 'inline-block',
              pb: 1,
              mx: 'auto',
              width: 'fit-content'
            }}
          >
            Câu Hỏi Thường Gặp
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {faqData.slice(0, 3).map((faq, index) => (
                <Accordion key={index} sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
            <Grid item xs={12} md={6}>
              {faqData.slice(3).map((faq, index) => (
                <Accordion key={index + 3} sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="bold">{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ContactPage
