"use client";

import { useState } from "react";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import Search from "./search/Search";
import Notification from "./notification/Notification";
import Group from "./group/Group";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { logout, reSetDetails, resetLoading } from "@/store/auth/authSlice";
import { useRouter } from "next/navigation";
import { useMyFriendsRequest } from "@/hooks/react-query/react-hooks/user/userHook";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Link from "next/link";
import { setChat, setGroup } from "@/store/chat/chatSlice";
import { resetOnlineOfflineUser } from "@/store/websocket/onlineofflineUserSlice";
import LogoutPopup from "./LogoutPopup";

const Header = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { data } = useMyFriendsRequest();

  const logoutHandler = () => {
    dispatch(logout())
      .then((res) => {
        if (res?.payload?.message) {
          dispatch(reSetDetails());
          dispatch(setChat(null));
          dispatch(setGroup(null));
          dispatch(resetOnlineOfflineUser());
          setLogoutOpen(false);
          router.push("/login");
        }
      })
      .finally(() => {
        dispatch(resetLoading());
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleNotification = () => {
    setIsNotification(true);
  };

  const handleGroup = () => {
    setIsGroup(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const closeNotificationHandler = () => {
    setIsNotification(false);
  };

  const closeGroupHandler = () => {
    setIsGroup(false);
  };

  return (
    <>
      {isAuthenticated && user ? (
        <>
          <Box sx={{ flexGrow: 1 }} height={"4rem"}>
            <AppBar
              position="static"
              sx={{
                bgcolor: "#ea7070",
              }}
            >
              <Toolbar>
                <Link
                  href={`${user?.role === "admin" ? "/admin" : "/"}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    Chat
                  </Typography>
                </Link>

                <Box
                  sx={{
                    display: { xs: "block", sm: "none" },
                  }}
                >
                  <IconButton color="inherit">
                    <MenuIcon />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    flexGrow: 1,
                  }}
                />
                <Box>
                  {user && user.role === "user" && (
                    <>
                      <IconButton color="inherit" onClick={handleClickOpen}>
                        <SearchIcon />
                      </IconButton>
                      <IconButton color="inherit" onClick={handleGroup}>
                        <AddIcon />
                      </IconButton>
                      <Link href={"/user/getgroups"}>
                        <IconButton color="inherit">
                          <GroupIcon />
                        </IconButton>
                      </Link>
                      <IconButton color="inherit" onClick={handleNotification}>
                        <Badge badgeContent={data?.length} color="secondary">
                          <NotificationsIcon />
                        </Badge>
                      </IconButton>
                      <Link href={"/user/account"}>
                        <IconButton color="inherit">
                          <AccountCircleIcon />
                        </IconButton>
                      </Link>

                      <IconButton
                        color="inherit"
                        onClick={() => setLogoutOpen(true)}
                      >
                        <LogoutIcon />
                      </IconButton>
                      <LogoutPopup
                        logoutOpen={logoutOpen}
                        setLogoutOpen={setLogoutOpen}
                        logoutHandler={logoutHandler}
                      />
                    </>
                  )}
                </Box>
              </Toolbar>
            </AppBar>
          </Box>

          {user && user.role === "user" && (
            <>
              <Search open={open} handleClose={handleClose} />
              <Notification
                isNotification={isNotification}
                closeNotificationHandler={closeNotificationHandler}
              />
              <Group isGroup={isGroup} closeGroupHandler={closeGroupHandler} />
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Header;
