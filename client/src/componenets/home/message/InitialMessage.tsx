import React from "react";
import CommentIcon from "@mui/icons-material/Comment";
import { Box, Typography } from "@mui/material";
const InitialMessage = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          backgroundColor: "#F7F7F7",
          width: "100%",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CommentIcon sx={{ fontSize: "5rem" }} />
          <Typography variant="h5" mt={1}>
            Chatt App For Web
          </Typography>
          <Typography variant="caption" mt={1} sx={{ display: "block" }}>
            Send a message to start a conversation with yours friends
          </Typography>
          <Typography variant="caption" mt={1}>
            Send and receive messages in real-time
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default InitialMessage;
