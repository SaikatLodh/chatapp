"use client";
import Sidebar from "@/componenets/admin/Sidebar";
import { Grid, Stack, Typography } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Groups as GroupsIcon,
  ManageAccounts as ManageAccountsIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutPopup from "@/componenets/LogoutPopup";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { logout, resetLoading } from "@/store/auth/authSlice";
import { ReactNode, useState } from "react";
interface AdminTab {
  name: string;
  path: string;
  icon: ReactNode;
}

const adminTabs: AdminTab[] = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupsIcon />,
  },
  {
    name: "Messages",
    path: "/admin/message",
    icon: <MessageIcon />,
  },
  {
    name: "Account",
    path: "/admin/account",
    icon: <AccountCircleIcon />,
  },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const logoutHandler = () => {
    dispatch(logout())
      .then((res) => {
        if (res?.payload?.message) {
          window.location.href = "/login";
        }
      })
      .finally(() => {
        dispatch(resetLoading());
      });
  };
  return (
    <>
      <Grid
        sx={{
          display: "flex",
          width: "100%",
        }}
      >
        <Grid item sx={{ display: { xs: "none", md: "block", width: "12%" } }}>
          <Stack direction={"column"} spacing={"3rem"} mt={"1.3rem"}>
            <Stack>
              {adminTabs.map((tab) => (
                <Stack
                  key={tab.path}
                  sx={
                    pathname === tab.path
                      ? {
                          backgroundColor: "#EA7070",
                          color: "white",
                          ":hover": {
                            color: "black",
                            backgroundColor: "white",
                            transition: "all 0.3s ease-in-out",
                          },
                          padding: "1.3rem 1rem",
                        }
                      : {
                          padding: "1.3rem 1rem",
                        }
                  }
                >
                  <Link href={tab.path}>
                    <Stack direction={"row"} alignItems={"center"} gap={"1rem"}>
                      {tab.icon}
                      <Typography>{tab.name}</Typography>
                    </Stack>
                  </Link>
                </Stack>
              ))}

              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={"1rem"}
                sx={{ cursor: "pointer", padding: "1.3rem 1rem" }}
                onClick={() => setLogoutOpen(true)}
              >
                <ExitToAppIcon />
                <Typography>Logout</Typography>
              </Stack>
              <LogoutPopup
                logoutOpen={logoutOpen}
                setLogoutOpen={setLogoutOpen}
                logoutHandler={logoutHandler}
              />
            </Stack>
          </Stack>
        </Grid>

        <Grid
          item
          sx={{
            bgcolor: "rgba(247,247,247,1)",
            width: { xs: "100%", md: "88%" },
          }}
        >
          {children}
        </Grid>
      </Grid>
    </>
  );
};

export default Layout;
