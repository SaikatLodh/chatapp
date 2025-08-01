import React from "react";
import RightHeader from "./RightHeader";
import Members from "./Members";
import { Box } from "@mui/material";
import { GroupList } from "@/type";

const RightMainWrapper = ({ groupData }: { groupData: GroupList }) => {
  return (
    <Box sx={{ backgroundColor: "#F7F7F7", width: "100%", }}>
      <RightHeader groupData={groupData} />
      <Box sx={{ width: "100%", height: "92%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Members groupData={groupData} />
      </Box>

    </Box>
  );
};

export default RightMainWrapper;
