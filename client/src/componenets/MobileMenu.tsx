import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
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

  React.useEffect(() => {
    if (pathname.startsWith("/user/getgroups")) {
      setOpen(true);
    }
    return () => {
      setOpen(false);
    };
  }, [pathname, setOpen]);
  return (
    <>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: { sm: "none" } }}
      >
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
