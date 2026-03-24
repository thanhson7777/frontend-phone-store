import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import SendIcon from "@mui/icons-material/Send";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link } from "react-router-dom";

// Social links
const socials = [
  { icon: <FacebookIcon />, url: "#", color: "#1877F2" },
  { icon: <YouTubeIcon />, url: "#", color: "#FF0000" },
  { icon: <InstagramIcon />, url: "#", color: "#E4405F" },
];

// Payment methods
const payments = [
  { name: "Visa", icon: "💳" },
  { name: "Mastercard", icon: "💳" },
  { name: "MoMo", icon: "📱" },
  { name: "ZaloPay", icon: "📱" },
];

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#1a1a2e",
        color: "white",
        pt: 6,
        pb: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Column 1: Logo & About */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <PhoneIphoneIcon sx={{ fontSize: 36, color: "error.main" }} />
              <Typography variant="h5" fontWeight="bold">
                PHONE STORE
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "#b0b0b0", mb: 3, lineHeight: 1.8 }}
            >
              Cửa hàng điện thoại chính hãng hàng đầu Việt Nam. Cam kết 100% sản
              phẩm chính hãng, bảo hành uy tín và giá cả cạnh tranh nhất thị
              trường.
            </Typography>

            {/* Social Links */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {socials.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.url}
                  target="_blank"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.1)",
                    color: "white",
                    "&:hover": {
                      bgcolor: social.color,
                      transform: "translateY(-3px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Column 2: Quick Links */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, fontSize: "1rem" }}
            >
              TRANG CHỦ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { label: "Trang chủ", path: "/" },
                { label: "Sản phẩm", path: "/products" },
                { label: "Danh mục", path: "/categories" },
                { label: "Bài viết", path: "/articles" },
                { label: "Liên hệ", path: "/contact" },
              ].map((link) => (
                <MuiLink
                  component={Link}
                  to={link.path}
                  key={link.path}
                  sx={{
                    color: "#b0b0b0",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": { color: "error.main" },
                    transition: "color 0.2s",
                  }}
                >
                  {link.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Column 3: Customer Support */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, fontSize: "1rem" }}
            >
              HỖ TRỢ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { label: "Chính sách bảo hành" },
                { label: "Chính sách đổi trả" },
                { label: "Chính sách giao hàng" },
                { label: "Câu hỏi thường gặp" },
              ].map((item) => (
                <MuiLink
                  href="#"
                  key={item.label}
                  sx={{
                    color: "#b0b0b0",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": { color: "error.main" },
                    transition: "color 0.2s",
                  }}
                >
                  {item.label}
                </MuiLink>
              ))}
            </Box>
          </Grid>

          {/* Column 4: Contact Info */}
          <Grid item xs={12} sm={4} md={4}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, fontSize: "1rem" }}
            >
              LIÊN HỆ
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <LocationOnIcon
                  sx={{ color: "error.main", fontSize: 20, mt: 0.3 }}
                />
                <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                  123 Nguyễn Trãi, P. Bến Thành, Q.1, TP. Hồ Chí Minh
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CallIcon sx={{ color: "error.main", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                  1900-1234 (24/7)
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <EmailIcon sx={{ color: "error.main", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                  contact@phonestore.vn
                </Typography>
              </Box>
            </Box>

            {/* Newsletter */}
            <Box sx={{ mt: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                ĐĂNG KÝ NHẬN TIN
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  placeholder="Email của bạn"
                  size="small"
                  sx={{
                    flex: 1,
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                      "&:hover fieldset": { borderColor: "error.main" },
                      "&.Mui-focused fieldset": { borderColor: "error.main" },
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#888",
                      opacity: 1,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="error"
                  sx={{ minWidth: "auto", px: 2 }}
                >
                  <SendIcon fontSize="small" />
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Divider */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            mt: 5,
            pt: 3,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* Copyright */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                sx={{ color: "#888", textAlign: { xs: "center", md: "left" } }}
              >
                © 2026 PHONE STORE. Tất cả quyền được bảo lưu.
              </Typography>
            </Grid>

            {/* Payment Methods */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                  gap: 2,
                }}
              >
                {payments.map((payment) => (
                  <Box
                    key={payment.name}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      bgcolor: "rgba(255,255,255,0.1)",
                      borderRadius: 1,
                      fontSize: "0.75rem",
                    }}
                  >
                    {payment.icon} {payment.name}
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
