import { Box, Input, Stack, Typography } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import ChatItem from "./ChatItem";
import { useChatList } from "@/hooks/react-query/react-hooks/chat/chatHook";
import SkeletonLoader from "./SkeletonLoader";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import SearchIcon from "@mui/icons-material/Search";
import { useInView } from "react-intersection-observer";
import InfiniteLoader from "./InfiniteLoader";

const ChatList = () => {
  const ITEMS_PER_LOAD = 8;
  const { ref, inView } = useInView({
    threshold: 1,
  });
  const [displayedItemsCount, setDisplayedItemsCount] =
    useState(ITEMS_PER_LOAD);
  const [search, setSearch] = React.useState<string>("");
  const { data, isLoading } = useChatList();

  const allPosts = data?.pages?.[0] || [];
  const currentDisplayedPosts = allPosts.slice(0, displayedItemsCount);
  const hasMoreLocal = displayedItemsCount < allPosts.length;

  const loadMoreItems = useCallback(() => {
    if (hasMoreLocal) {
      setDisplayedItemsCount((prevCount) =>
        Math.min(prevCount + ITEMS_PER_LOAD, allPosts.length)
      );
    }
  }, [hasMoreLocal, allPosts.length]);

  useEffect(() => {
    if (inView && hasMoreLocal && !isLoading) {
      loadMoreItems();
    }
  }, [inView, hasMoreLocal, isLoading, loadMoreItems]);

  const filteredData = currentDisplayedPosts?.filter((chat) =>
    chat.name.trim().toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <>
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
          filteredData.map((chat) => <ChatItem key={chat._id} data={chat} />)
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
        {hasMoreLocal && (
          <Box ref={ref} sx={{ padding: "20px", textAlign: "center" }}>
            <InfiniteLoader />
          </Box>
        )}
      </Stack>
    </>
  );
};

export default ChatList;
