import {
  Avatar,
  Box,
  IconButton,
  Input,
  Stack,
  Typography,
} from "@mui/material";
import React, { Fragment, useRef, useState } from "react";
import { Send as SendIcon } from "@mui/icons-material";
import UserMessage from "./UserMessage";
import FileMenu from "./FileMenu";
import {
  useGetMessage,
  useSendMessage,
} from "@/hooks/react-query/react-hooks/chat/chatHook";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useForm, SubmitHandler } from "react-hook-form";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteChat from "./DeleteChat";
import AttachFileIcon from "./AttachFileIcon";
import { transformImage } from "@/features/features";
import Typing from "./TypingUser";
import MicIcon from "@mui/icons-material/Mic";
import AudioSpeach from "./AudioSpeach";
import { useSpeechRecognition } from "react-speech-recognition";
import NoMessage from "./NoMessage";
type Inputs = {
  content: string;
};

const Message = () => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeach, setIsSpeach] = useState(false);
  const { data: chatData } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const { typing } = useSelector((state: RootState) => state.typing);
  const { data } = useGetMessage(chatData?._id as string);
  const [open, setOpen] = React.useState(false);
  const { mutate } = useSendMessage();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const filterFriend =
    chatData?.groupChat === false
      ? chatData?.members.filter((member) => member !== user?._id)[0]
      : "";
  const isFriend =
    chatData?.groupChat === false
      ? user?.friends.includes(filterFriend as string)
      : true;

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const { register, handleSubmit, watch, reset } = useForm<Inputs>();
  const content = watch("content", "");
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const formdata = new FormData();
    formdata.append("content", data.content);
    formdata.append("isGroup", chatData?.groupChat.toString() as string);
    mutate(
      { data: formdata, id: chatData?._id as string },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  const isMumber = chatData?.members.includes(user?._id as string);
  const filterMe = chatData?.members.filter((member) => member === user?._id);
  const filterOther = chatData?.members.filter(
    (member) => member !== user?._id
  );
  const typingUser = chatData?.MembersDetails?.filter((member) =>
    typing.includes(member._id)
  );

  const { browserSupportsSpeechRecognition } = useSpeechRecognition();

  return (
    <>
      <Fragment>
        <Box
          sx={{
            position: "relative",
            backgroundColor: "white",
            height: "8%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
          }}
        >
          <Box>
            {chatData &&
              chatData.avatar.map((i, index) => (
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
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              ))}

            <Typography variant="h6" textAlign={"center"}>
              {chatData?.name}
            </Typography>
            <Typing
              content={content}
              isTyping={isTyping}
              setIsTyping={setIsTyping}
              typingTimeoutRef={typingTimeoutRef}
              filterMe={filterMe}
              filterOther={filterOther}
              typingUser={typingUser}
            />
            {isFriend ? (
              ""
            ) : (
              <Typography
                variant="h6"
                textAlign={"center"}
                sx={{ fontSize: "0.8rem" }}
              >
                You are not friends
              </Typography>
            )}
          </Box>

          {!chatData?.groupChat && (
            <Box>
              <Typography>
                {data && data.length > 0 && (
                  <MoreVertIcon
                    onClick={() => setOpenDelete(true)}
                    sx={{ cursor: "pointer" }}
                  />
                )}
              </Typography>
            </Box>
          )}
        </Box>

        <Stack
          boxSizing={"border-box"}
          padding={"1rem"}
          spacing={"1rem"}
          bgcolor={"rgba(247,247,247,1)"}
          height={"82%"}
          sx={{
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          {data && data.length > 0 ? (
            data.map((item) => <UserMessage key={item._id} data={item} />)
          ) : (
            <>
              <NoMessage />
            </>
          )}
        </Stack>

        <form
          style={{
            height: "10%",
            position: "relative",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack
            direction={"row"}
            height={"100%"}
            padding={"1rem"}
            alignItems={"center"}
            position={"relative"}
          >
            <IconButton
              sx={{
                position: "absolute",
                left: { sm: "-1.8rem", xs: "-1rem" },
                rotate: "-42deg",
                zIndex: 20,
              }}
              disabled={isFriend ? false : true}
            >
              <AttachFileIcon onClick={handleClick} />
            </IconButton>

            <Input
              placeholder={`${
                isFriend ? "Type a message" : "You are not friends"
              }`}
              sx={{
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                padding: "0.5rem",
                borderRadius: "1.5rem",
                backgroundColor: "rgba(247,247,247,1)",
              }}
              {...register("content", { required: true })}
              disabled={isFriend ? false : true}
            />

            <IconButton
              type="submit"
              sx={{
                rotate: "-30deg",
                bgcolor: "#ea7070",
                color: "white",
                marginLeft: "1rem",
                padding: "0.5rem",
                "&:hover": {
                  bgcolor: "error.dark",
                },
              }}
              disabled={!content || !isMumber}
            >
              <SendIcon />
            </IconButton>
            <IconButton
              sx={{
                bgcolor: "#ea7070",
                color: "white",
                marginLeft: "1rem",
                padding: "0.5rem",
                "&:hover": {
                  bgcolor: "error.dark",
                },
              }}
              onClick={() => setIsSpeach(true)}
              disabled={
                !browserSupportsSpeechRecognition || isFriend ? false : true
              }
            >
              <MicIcon />
            </IconButton>
          </Stack>
        </form>

        <FileMenu
          open={open}
          handleClose={handleClose}
          chatDetailes={chatData}
        />
        <DeleteChat
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          id={chatData?._id as string}
        />
        <AudioSpeach
          isSpeach={isSpeach}
          setIsSpeach={setIsSpeach}
          chatData={chatData}
          mutate={mutate}
        />
      </Fragment>
    </>
  );
};

export default Message;
