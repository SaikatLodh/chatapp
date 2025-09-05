import { Box, Paper, Typography } from "@mui/material";
import React from "react";
import CommentIcon from "@mui/icons-material/Comment";
const NoMessage = () => {
  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 3,
          bgcolor: "grey.100",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box>
          <CommentIcon sx={{ fontSize: "5rem" }} />
          <Typography variant="h6" color="text.secondary">
            No messages yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start the conversation by sending a message.
          </Typography>
        </Box>
      </Paper>
    </>
  );
};

export default NoMessage;
