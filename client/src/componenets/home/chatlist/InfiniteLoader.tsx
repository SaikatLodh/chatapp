import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const InfiniteLoader = () => {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress sx={{ color: "#EA7070" }} />
      </Box>
    </>
  );
};

export default InfiniteLoader;
