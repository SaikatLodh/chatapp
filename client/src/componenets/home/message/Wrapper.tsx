import { useChatList } from "@/hooks/react-query/react-hooks/chat/chatHook";
import React from "react";
import { useSelector } from "react-redux";
import Message from "./Message";
import InitialMessage from "./InitialMessage";
import { RootState } from "@/store/store";
import { Grid } from "@mui/material";

const Wrapper = () => {
  const { data: chat } = useSelector((state: RootState) => state.chat);
  const { data } = useChatList();

  return (
    <>
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        lg={6}
        height={"100%"}
        sx={{
          display: { sm: "block" },
          width: {
            xs: "100%",
            sm: data && data?.pages?.[0]?.length > 0 ? "60%" : "80%",
          },
        }}
      >
        {chat ? <Message /> : <InitialMessage />}
      </Grid>
    </>
  );
};

export default Wrapper;
