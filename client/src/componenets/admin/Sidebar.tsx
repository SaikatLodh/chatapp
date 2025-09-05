import { Drawer, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { ReactNode, useState } from "react";
import {
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Groups as GroupsIcon,
  ManageAccounts as ManageAccountsIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import LogoutPopup from "../LogoutPopup";
import { logout, resetLoading } from "@/store/auth/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
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

const Sidebar = ({
  isMobile,
  handleMobile,
}: {
  isMobile: boolean;
  handleMobile: () => void;
}) => {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const logoutHandler = () => {
    dispatch(logout())
      .then((res) => {
        if (res?.payload?.message) {
          router.push("/login");
        }
      })
      .finally(() => {
        dispatch(resetLoading());
      });
  };
  return (
    <>
      <Drawer open={isMobile} onClose={handleMobile} anchor="left">
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
      </Drawer>
    </>
  );
};

export default Sidebar;
