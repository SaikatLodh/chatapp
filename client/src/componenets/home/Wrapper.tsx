"use client";
import { Grid } from "@mui/material";
import React from "react";
import ChatList from "./chatlist/ChatList";
import Profile from "./profile/Profile";
import {
  useChatList,
  useGroupList,
} from "@/hooks/react-query/react-hooks/chat/chatHook";
import { usePathname } from "next/navigation";
import UserList from "../grouplist/left/UserList";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { data } = useChatList();
  const { data: group } = useGroupList();

  return (
    <>
      <Grid container height={"calc(100vh - 4rem)"}>
        {(pathname === "/" || pathname === "/user/getgroups") && (
          <>
            {pathname === "/" ? (
              <>
                {data && data?.pages?.[0]?.length > 0 ? (
                  <Grid
                    item
                    sm={4}
                    md={3}
                    sx={{
                      display: { xs: "none", sm: "block" },
                      width: { xs: "100%", sm: "100%", md: "20%", lg: "20%" },
                    }}
                    height={"100%"}
                  >
                    <ChatList />
                  </Grid>
                ) : null}
              </>
            ) : pathname === "/user/getgroups" ? (
              <>
                {group && group?.length > 0 ? (
                  <Grid
                    item
                    sm={4}
                    md={3}
                    sx={{
                      display: { xs: "none", sm: "block" },
                      width: { xs: "100%", sm: "100%", md: "20%", lg: "20%" },
                    }}
                    height={"100%"}
                  >
                    <UserList />
                  </Grid>
                ) : null}
              </>
            ) : null}
          </>
        )}

        {children}
        {(pathname === "/" || pathname === "/user/getgroups") && (
          <>
            <Grid
              item
              md={4}
              lg={3}
              height={"100%"}
              sx={{
                display: { xs: "none", md: "block" },
                padding: "2rem",
                bgcolor: "rgba(0,0,0,0.85)",
                width: { xs: "100%", sm: "100%", md: "20%", lg: "20%" },
              }}
            >
              <Profile />
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default Wrapper;
