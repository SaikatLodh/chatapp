import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ChatList from "./home/chatlist/ChatList";
import { usePathname } from "next/navigation";
import UserList from "./grouplist/left/UserList";

const MobileMenu = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const pathname = usePathname();
  return (
    <>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280 }} role="presentation">
          {(pathname === "/" || pathname === "/user/getgroups") && (
            <>
              {pathname === "/" ? (
                <>
                  <ChatList />
                </>
              ) : pathname === "/user/getgroups" ? (
                <>
                  <UserList />
                </>
              ) : null}
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default MobileMenu;
