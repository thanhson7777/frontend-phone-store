import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import AuthButtons from "./AuthButtons";
import { Link, useLocation } from "react-router-dom";

const mainMenu = [
  {
    label: "Trang chủ",
    path: "/",
  },
  {
    label: "Sản phẩm",
    path: "/products",
  },
  {
    label: "Danh mục",
    path: "/categories",
  },
  {
    label: "Bài viết",
    path: "/articles",
  },
  {
    label: "Liên hệ",
    path: "/contact",
  },
];

function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "error.main", zIndex: 1100 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 1, md: 3 },
        }}
      >
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 4 }}>
            {mainMenu.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: "white",
                  fontWeight: isActive(item.path) ? "bold" : "normal",
                  borderBottom: isActive(item.path)
                    ? "3px solid white"
                    : "3px solid transparent",
                  borderRadius: 0,
                  px: 2,
                  py: 1,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Search Bar + Actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, md: 2 },
          }}
        >
          {/* Search Bar */}
          <SearchBar />

          {/* Cart */}
          <CartIcon />

          {/* Auth */}
          <AuthButtons />

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{ ml: 0.5 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Menu Dropdown */}
      {isMobile && mobileMenuOpen && (
        <Box
          sx={{
            bgcolor: "error.dark",
            py: 1,
            px: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {mainMenu.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              fullWidth
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                color: "white",
                justifyContent: "flex-start",
                py: 1.5,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                bgcolor: isActive(item.path)
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      )}
    </AppBar>
  );
}

export default Header;
