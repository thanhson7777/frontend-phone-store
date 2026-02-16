import { Box, Typography } from '@mui/material'

function Footer() {
  return (
    <Box sx={{
      bgcolor: '#2f3542',
      color: 'white',
      py: 3,
      textAlign: 'center',
      mt: 'auto' // Đẩy footer xuống tít dưới cùng nếu nội dung trang quá ngắn
    }}>
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        © 2026 PHONE STORE - Chuyên điện thoại xịn.
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: '#ced6e0' }}>
        Địa chỉ: 123 Đường Code Dạo, Quận React, TP. MERN Stack
      </Typography>
    </Box>
  )
}

export default Footer