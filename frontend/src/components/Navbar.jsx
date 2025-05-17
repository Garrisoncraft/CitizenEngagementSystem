import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const updateUserRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserRole(decoded.role);
      } catch {
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  };

  useEffect(() => {
    updateUserRole();
    const handleStorage = () => {
      updateUserRole();
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserRole(null);
    navigate("/");

    window.dispatchEvent(new Event("storage"));
  };

  return (
    <AppBar
      position="static"
      color="default"
      sx={{
        boxShadow: "none",
        borderRadius: 40,
        borderBottom: "1px solid #ddd",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            component="img"
            src={Logo}
            alt="CitizenConnect Logo"
            sx={{ borderRadius: 40, height: 32, width: 32 }}
          />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "#1e40af", fontWeight: 700 }}
          >
            CitizenConnect
          </Typography>
        </Box>

        {/* Desktop Links */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 3,
          }}
        >
          <Button
            component={Link}
            to="/"
            color="inherit"
            sx={{ color: "#333", textTransform: "none" }}
          >
            Home
          </Button>
          {(userRole === "admin" || userRole === "agency") && (
            <Button
              component={Link}
              to="/admin/dashboard"
              color="inherit"
              sx={{ color: "#1e40af", textTransform: "none", fontWeight: 600 }}
            >
              Admin Dashboard
            </Button>
          )}
          <Button
            component={Link}
            to="/why-ces"
            color="inherit"
            sx={{ color: "#333", textTransform: "none" }}
          >
            Why CES
          </Button>
          <Button
            component={Link}
            to="/success-story"
            color="inherit"
            sx={{ color: "#333", textTransform: "none" }}
          >
            Success Story
          </Button>
          <Button
            component={Link}
            to="/status"
            variant="outlined"
            sx={{
              textTransform: "none",
              borderColor: "#ccc",
              color: "#333",
              mr: 1,
            }}
          >
            Track Complaint
          </Button>
          <Button
            component={Link}
            to="/submit"
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#1e40af",
              "&:hover": { backgroundColor: "#1c3aa9" },
            }}
          >
            Submit Feedback
          </Button>
          {userRole === "admin" ? (
            <Button
              onClick={handleLogout}
              sx={{ textTransform: "none", color: "#333" }}
            >
              Logout
            </Button>
          ) : (
            <Button
              component={Link}
              to="/login"
              sx={{ textTransform: "none", color: "#333" }}
            >
              Login
            </Button>
          )}
        </Box>

        {/* Mobile Hamburger Menu */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem component={Link} to="/" onClick={handleClose}>
              Home
            </MenuItem>
            {(userRole === "admin" || userRole === "agency") && (
              <MenuItem
                component={Link}
                to="/admin/dashboard"
                onClick={handleClose}
              >
                Admin Dashboard
              </MenuItem>
            )}
            <MenuItem component={Link} to="/why-ces" onClick={handleClose}>
              Why CES
            </MenuItem>
            <MenuItem
              component={Link}
              to="/success-story"
              onClick={handleClose}
            >
              Success Story
            </MenuItem>
            <MenuItem component={Link} to="/status" onClick={handleClose}>
              Track Complaint
            </MenuItem>
            <MenuItem component={Link} to="/submit" onClick={handleClose}>
              Submit Feedback
            </MenuItem>
            {userRole === "admin" || userRole === "agency" ? (
              <MenuItem
                onClick={() => {
                  handleLogout();
                  handleClose();
                }}
              >
                Logout
              </MenuItem>
            ) : (
              <MenuItem component={Link} to="/login" onClick={handleClose}>
                Login
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
