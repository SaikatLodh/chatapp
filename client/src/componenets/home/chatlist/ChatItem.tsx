import React from "react";
import { motion } from "framer-motion";
import { Stack, Typography } from "@mui/material";
import { ChatList } from "@/type";
import { Avatar, AvatarGroup, Box } from "@mui/material";
import { setChat } from "@/store/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import DeleteChat from "./DeleteChat";
import { resetMessageAleart } from "@/store/websocket/messageAlertSlice";
import { transformImage } from "@/features/features";

const ChatItem = ({ data }: { data: ChatList }) => {
  const [open, setOpen] = React.useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: chat } = useSelector((state: RootState) => state.chat);
  const { messageAlert } = useSelector(
    (state: RootState) => state.messageAlert
  );
  const { data: online } = useSelector(
    (state: RootState) => state.onlineofflineUser
  );
  const dispatch = useDispatch<AppDispatch>();

  const findId = data.members.find((member) => member !== user?._id);
  const isOnline = online.some((user) => user === findId);

  const handelClick = (e: React.MouseEvent) => {
    if (e.nativeEvent.button === 0) {
      dispatch(setChat(data));
    } else if (e.nativeEvent.button === 1) {
      console.log("right click");
      setOpen(true);
    }
    dispatch(resetMessageAleart(data._id));
  };

  const checkChatId = messageAlert.some((item) => item.chatId === data._id);
  const isOpenChat = messageAlert.find((item) => item.chatId === data?._id);
  const getValue = messageAlert.map((item) =>
    item.chatId === data._id ? item.count : null
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * 0 }}
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          backgroundColor: chat?._id === data._id ? "#EA7070" : "#262626",
          color: "white",
          position: "relative",
          padding: "1rem",
          cursor: "pointer",
          marginBottom: "1rem",
          borderRadius: "10px",
          marginRight: "1rem",
          marginLeft: "1rem",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          border: chat?._id === data._id ? "3px solid white" : "none",
        }}
        onClick={handelClick}
        onContextMenu={handelClick}
      >
        <Stack direction={"row"} spacing={0.5}>
          <AvatarGroup
            max={4}
            sx={{
              position: "relative",
            }}
          >
            <Box width={"5rem"} height={"3rem"} position="relative">
              {data.avatar.map((i, index) => (
                <Avatar
                  key={index}
                  src={transformImage(
                    (i.avatar && i.avatar.url) ||
                      (i.gooleavatar && i.gooleavatar)
                  )}
                  alt={`Avatar ${index}`}
                  sx={{
                    width: "3rem",
                    height: "3rem",
                    position: "absolute",
                    left: `${index}rem`,
                  }}
                />
              ))}
            </Box>
          </AvatarGroup>
        </Stack>

        <Stack>
          <Typography>{data.name}</Typography>
          <Typography sx={{ fontSize: "0.8rem", mt: "0.5rem" }}>
            {checkChatId && isOpenChat?.chatId !== chat?._id ? (
              <>{getValue[0]} new messages</>
            ) : (
              ""
            )}
          </Typography>
        </Stack>

        {data.groupChat === false && isOnline && (
          <>
            <Box
              sx={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "green",
                position: "absolute",
                top: "50%",
                right: "1rem",
                transform: "translateY(-50%)",
              }}
            />
          </>
        )}
      </motion.div>
      <DeleteChat open={open} setOpen={setOpen} />
    </>
  );
};

export default ChatItem;
