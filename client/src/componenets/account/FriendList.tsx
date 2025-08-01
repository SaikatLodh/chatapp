import {
  useGetmyFriends,
  useRemovefriend,
} from "@/hooks/react-query/react-hooks/user/userHook";
import { Avatar, Box, Button, Typography } from "@mui/material";
import React from "react";
import SkeletonLoader from "./SkeletonLoader";

const FriendList = () => {
  const { data, isLoading } = useGetmyFriends();
  const { mutate } = useRemovefriend();
  return (
    <>
      {isLoading ? (
        <SkeletonLoader />
      ) : data && data.friends.length > 0 ? (
        data.friends.map((friend) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 2,
              borderBottom: "1px solid #ccc",
              gap: 2,
              width: "100%",
            }}
            key={friend._id}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Avatar
                alt="Friend's Name"
                src={
                  (friend.avatar && friend.avatar.url) ||
                  (friend.gooleavatar && friend.gooleavatar)
                }
              />
              <Box>
                <Typography variant="body1">{friend.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Last message preview...
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              size="small"
              sx={{
                marginLeft: "auto",
                color: "#ea7070",
                borderColor: "#ea7070",
                px: 3,
              }}
              onClick={() => mutate(friend._id)}
            >
              Remove
            </Button>
          </Box>
        ))
      ) : (
        <Box
          sx={{
            textAlign: "center",
            fontSize: "1.2rem",
            color: "text.secondary",
          }}
        >
          You have no friends yet
        </Box>
      )}
    </>
  );
};

export default FriendList;
