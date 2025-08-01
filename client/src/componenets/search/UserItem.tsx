import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import React from "react";
import { Add as AddIcon } from "@mui/icons-material";
import { SearchUser } from "@/type";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useSendFriendRequest } from "@/hooks/react-query/react-hooks/user/userHook";
const UserItem = ({ user }: { user: SearchUser }) => {
  const { user: loginuser } = useSelector((state: RootState) => state.auth);
  const { mutate } = useSendFriendRequest(user._id);

  return (
    <>
      <ListItem>
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={"1rem"}
          width={"100%"}
        >
          <Avatar
            src={
              (user.avatar && user.avatar.url) ||
              (user.gooleavatar && user.gooleavatar)
            }
          />
          <Typography
            variant="body1"
            sx={{
              flexGlow: 1,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
            }}
          >
            {user.name}
          </Typography>
          {user?.friends?.includes(loginuser?._id || "") ? (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: "0.8rem",
              }}
            >
              Friends
            </Typography>
          ) : user.request.some(
              (item) => item.receiver === user?._id && item.status === "sent"
            ) ? (
            <IconButton size="small">Request Sent</IconButton>
          ) : user.request.some(
              (item) => item.sender === user?._id && item.status === "sent"
            ) ? (
            <IconButton size="small">Request Received</IconButton>
          ) : (
            <IconButton size="small" onClick={() => mutate()}>
              <AddIcon />
            </IconButton>
          )}
        </Stack>
      </ListItem>
    </>
  );
};

export default UserItem;
