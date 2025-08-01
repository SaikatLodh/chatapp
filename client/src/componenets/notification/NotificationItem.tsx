import { useAcceptFriendRequest } from "@/hooks/react-query/react-hooks/user/userHook";
import { FriendRequestNotification } from "@/type";
import { Avatar, Button, ListItem, Stack, Typography } from "@mui/material";
import React from "react";

const NotificationItem = ({ data }: { data: FriendRequestNotification }) => {
  const acceptData = {
    senderId: data.sender._id,
    accept: true,
  };

  const rejectData = {
    senderId: data.sender._id,
    accept: false,
  };

  const { mutate } = useAcceptFriendRequest();

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
              (data.sender.avatar && data.sender.avatar?.url) ||
              (data.sender.gooleavatar && data.sender.gooleavatar)
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
            {data.sender?.name}
          </Typography>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
          >
            <Button onClick={() => mutate(acceptData)}>Accept</Button>
            <Button color="error" onClick={() => mutate(rejectData)}>
              Reject
            </Button>
          </Stack>
        </Stack>
      </ListItem>
    </>
  );
};

export default NotificationItem;
