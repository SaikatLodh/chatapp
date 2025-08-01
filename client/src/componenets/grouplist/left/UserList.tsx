import React, { useState } from "react";
import { Box, Input, Stack, Typography } from "@mui/material";
import UserListItem from "./UserListItem";
import { useGroupList } from "@/hooks/react-query/react-hooks/chat/chatHook";
import SkeletonLoader from "./SkeletonLoader";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import SearchIcon from "@mui/icons-material/Search";

const UserList: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const { data, isLoading } = useGroupList();
  const filteredData = data?.filter((chat) =>
    chat.name.trim().toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <Stack
      width={"100%"}
      direction={"column"}
      overflow={"auto"}
      height={"100%"}
    >
      <Input
        placeholder="Search or start a new chat"
        sx={{
          mb: "1rem",
          ml: "1rem",
          mr: "1rem",
          mt: "1rem",
          fontWeight: "bold",
          fontSize: "1rem",
        }}
        startAdornment={<SearchIcon />}
        onChange={(e) => setSearch(e.target.value)}
      />
      {isLoading ? (
        <SkeletonLoader />
      ) : filteredData && filteredData.length > 0 ? (
        filteredData.map((chat) => <UserListItem key={chat._id} data={chat} />)
      ) : (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AnnouncementIcon sx={{ fontSize: "3rem" }} />
          <Typography variant="h6" sx={{ fontSize: "1rem" }}>
            No Chats Found
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default UserList;
