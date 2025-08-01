"use client";
import { Box, Drawer, Grid, IconButton } from "@mui/material";
import { Close as CloseIcon, Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
import Sidebar from "@/componenets/admin/Sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => setIsMobile(!isMobile);

  const handleClose = () => setIsMobile(false);
  return (
    <>
      <Grid
        sx={{
          display: "flex",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            position: "fixed",
            right: "1rem",
            top: "1rem",
          }}
        >
          <IconButton onClick={handleMobile}>
            {isMobile ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>

        <Grid item sx={{ display: { xs: "none", md: "block", width: "12%" } }}>
          <Sidebar />
        </Grid>

        <Grid
          item
          sx={{
            bgcolor: "rgba(247,247,247,1)",
            width: { xs: "100%", md: "88%" },
          }}
        >
          {children}
        </Grid>

        <Drawer open={isMobile} onClose={handleClose}>
          <Sidebar />
        </Drawer>
      </Grid>
    </>
  );
};

export default Layout;
