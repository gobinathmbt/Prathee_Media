import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Modal, Box, Paper } from "@mui/material";
import { Home } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../DataBaseConfig/AuthContext";
import { Logout } from "@mui/icons-material";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false); // State to control the modal

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const name = sessionStorage.getItem("name");

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ backgroundColor: "black" }}>
        <Home component={NavLink} to="/home" />
        <Typography
          variant="h6"
          component={NavLink}
          to="/home"
          sx={{ flexGrow: 1, textDecoration: "none", color: "white", fontWeight: "bold" }}
        >
         Employee Details
        </Typography>
        <Button color="inherit" component={NavLink} to="/employee">
        Employee
        </Button>
        <Typography
          variant="h6"
          component={NavLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "white", fontWeight: "bold" }}
        ></Typography>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <h3> Welcome </h3>
          <h4> {name}</h4>
          <Button sx={{ marginLeft: "20px" }} variant="contained" color="error" onClick={handleOpen} startIcon={<Logout />}>
            Logout
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to logout?
              </Typography>
              <Button onClick={handleLogout} variant="contained" color="error" sx={{ mt: 2, mr: 2 }}>
                Yes
              </Button>
              <Button onClick={handleClose} variant="contained" sx={{ mt: 2 }}>
                Cancel
              </Button>
            </Box>
          </Modal>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
