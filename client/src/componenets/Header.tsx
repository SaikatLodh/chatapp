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
import { useMyFriendsRequest } from "@/hooks/react-query/react-hooks/user/userHook";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Link from "next/link";
import { setChat, setGroup } from "@/store/chat/chatSlice";
import { resetOnlineOfflineUser } from "@/store/websocket/onlineofflineUserSlice";
import LogoutPopup from "./LogoutPopup";
import MobileMenu from "./MobileMenu";
import { usePathname } from "next/navigation";
import Sidebar from "./admin/Sidebar";

const Header = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const [open, setOpen] = useState(false);
  const [baeOpen, setBaeOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const handleMobile = () => setIsMobile(!isMobile);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const location = usePathname();
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
          window.location.href = "/login";
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
                <Box>
                  <Link
                    href={`${user?.role === "admin" ? "/admin" : "/"}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        display: {
                          xs: `${
                            location.startsWith("/admin") ? "block" : "none"
                          }`,
                          sm: "block",
                        },
                      }}
                    >
                      Chat
                    </Typography>
                  </Link>
                </Box>

                <Box
                  sx={{
                    display: {
                      xs: "flex",
                      sm: "none",
                      width: location.startsWith("/admin") ? "100%" : "auto",
                      justifyContent: "flex-end",
                    },
                  }}
                >
                  {location.startsWith("/admin") ? (
                    <IconButton color="inherit" onClick={handleMobile}>
                      <MenuIcon />
                    </IconButton>
                  ) : (
                    <>
                      {!location.startsWith("/user/account") && (
                        <IconButton
                          color="inherit"
                          onClick={() => setBaeOpen(true)}
                        >
                          <MenuIcon />
                        </IconButton>
                      )}
                    </>
                  )}
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
              <MobileMenu open={baeOpen} setOpen={setBaeOpen} />
            </>
          )}
          {user && user.role === "admin" && (
            <Sidebar isMobile={isMobile} handleMobile={handleMobile} />
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Header;
