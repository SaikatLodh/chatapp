import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import { GroupList } from "@/type";
import EditePoup from "./EditePoup";

const RightHeader = ({ groupData }: { groupData: GroupList }) => {
  const [open, setOpen] = useState(false);
  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: "1px solid #e0e0e0" }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <Link href={"/"}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark background for the icon button
              color: "white", // White icon color
              borderRadius: "50%", // Make it circular
              width: 40, // Fixed width for circular button
              height: 40, // Fixed height for circular button
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.9)", // Darker on hover
              },
              marginLeft: 2,
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Link>
        {/* Center Section: Group Name and Edit Icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "normal", fontSize: "1.2rem" }}
          >
            {groupData.name}
          </Typography>
          <IconButton
            color="inherit"
            aria-label="edit"
            sx={{ marginLeft: 1, color: "text.secondary" }}
            onClick={() => setOpen(true)}
          >
            <EditIcon sx={{ fontSize: "1rem" }} />
          </IconButton>
        </Box>
        <EditePoup open={open} setOpen={setOpen} groupData={groupData} />
      </Toolbar>
    </AppBar>
  );
};

export default RightHeader;
