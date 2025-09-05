"use client";
import { Grid } from "@mui/material";
import { useState } from "react";

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
        <Grid
          item
          sx={{
            bgcolor: "rgba(247,247,247,1)",
            width: { xs: "100%", md: "88%" },
          }}
        >
          {children}
        </Grid>
      </Grid>
    </>
  );
};

export default Layout;
