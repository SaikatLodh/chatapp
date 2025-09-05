import { Box, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import React from "react";
import NotificationItem from "./NotificationItem";
import { useMyFriendsRequest } from "@/hooks/react-query/react-hooks/user/userHook";
import SkeletonLoader from "./SkeletonLoader";
import NotificationsIcon from "@mui/icons-material/Notifications";
const Notification = ({
  isNotification,
  closeNotificationHandler,
}: {
  isNotification: boolean;
  closeNotificationHandler: () => void;
}) => {
  const { data, isLoading } = useMyFriendsRequest();

  return (
    <>
      <Dialog open={isNotification} onClose={closeNotificationHandler}>
        <Stack
          p={{ xs: "1rem", sm: "2rem" }}
          width={"25rem"}
          maxHeight={"520px"}
          overflow={"auto"}
          spacing={"2rem"}
        >
          <DialogTitle textAlign={"center"}>Notifications</DialogTitle>

          {isLoading ? (
            <SkeletonLoader />
          ) : data && data.length > 0 ? (
            data.map((item) => <NotificationItem data={item} key={item._id} />)
          ) : (
            <>
              <Box
                sx={{
                  textAlign: "center",
                  fontSize: "1.2rem",
                  color: "text.secondary",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <NotificationsIcon />
                <Typography>
                  {" "}
                  No notifications available at the moment.
                </Typography>
              </Box>
            </>
          )}
        </Stack>
      </Dialog>
    </>
  );
};

export default Notification;
