import { Avatar, Box, Typography } from "@mui/material";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Message } from "@/type";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import moment from "moment";
import ScrollToBottom from "./ScrollToBottom";

const UserMessage = ({ data }: { data: Message }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: "-100%" }}
        whileInView={{ opacity: 1, x: 0 }}
        style={{
          alignSelf: user?._id === data.sender._id ? "flex-end" : "flex-start",
          backgroundColor: user?._id === data.sender._id ? "white" : "#E6E6E6",
          color: "black",
          borderRadius: "5px",
          padding: "0.5rem",
          width: "fit-content",
        }}
        ref={messagesEndRef}
      >
        <Box>
          {data.attachments && data.attachments?.length > 0
            ? data.attachments?.map((item, index) => {
                const image =
                  item.url.endsWith(".jpg") ||
                  item.url.endsWith(".png") ||
                  item.url.endsWith(".jpeg") ||
                  item.url.endsWith(".gif");

                const video =
                  item.url.endsWith(".mp4") ||
                  item.url.endsWith(".webm") ||
                  item.url.endsWith(".ogg");

                const audio =
                  item.url.endsWith(".mp3") ||
                  item.url.endsWith(".wav") ||
                  item.url.endsWith(".ogg") ||
                  item.url.endsWith(".mpeg");

                const pdf = item.url.endsWith(".pdf");
                return (
                  <Box key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        my: 1,
                      }}
                    >
                      <Avatar
                        alt={data.sender.name}
                        src={
                          data.sender.avatar?.url || data.sender.gooleavatar
                        }
                      />
                      <Typography sx={{ fontSize: "14px" }}>
                        {data.sender.name}
                      </Typography>
                    </Box>{" "}
                    {image && (
                      <Box
                        component={"img"}
                        src={item.url}
                        sx={{
                          width: "200px",
                          height: "200px",
                          objectFit: "contain",
                        }}
                      />
                    )}
                    {video && (
                      <Box
                        component={"video"}
                        src={item.url}
                        sx={{
                          width: "200px",
                          height: "200px",
                          objectFit: "cover",
                        }}
                        controls
                      />
                    )}
                    {audio && (
                      <audio
                        src={item.url}
                        controls
                        style={{
                          width: "200px",
                          height: "200px",
                          objectFit: "contain",
                        }}
                      ></audio>
                    )}
                    {pdf && (
                      <a href={item.url} target="_blank">
                        <embed
                          src={item.url}
                          style={{
                            width: "200px",
                            height: "200px",
                            objectFit: "contain",
                          }}
                          type="application/pdf"
                        ></embed>
                      </a>
                    )}
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: "100",
                        color: "gray",
                        mt: "5px",
                      }}
                      component="div"
                    >
                      <Typography sx={{ fontSize: "14px" }} component="span">
                        {moment(data.createdAt).fromNow()}
                      </Typography>
                    </Typography>
                  </Box>
                );
              })
            : data.content?.split("\n").map((item: string, index) => (
                <Box key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      my: 1,
                    }}
                  >
                    <Avatar
                      alt={data.sender.name}
                      src={data.sender.avatar?.url || data.sender.gooleavatar}
                    />
                    <Typography sx={{ fontSize: "14px" }}>
                      {data.sender.name}
                    </Typography>
                  </Box>{" "}
                  <Typography
                    sx={{ fontSize: "18px", fontWeight: "100", py: 1 }}
                  >
                    {item}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: "100",
                      color: "gray",
                      mt: "3px",
                    }}
                    component="div"
                  >
                    <Typography sx={{ fontSize: "14px" }} component="span">
                      {moment(data.createdAt).fromNow()}
                    </Typography>
                  </Typography>
                </Box>
              ))}
        </Box>
        <Typography variant="caption" color={"text.secondary"}></Typography>
      </motion.div>
      <ScrollToBottom data={data} messagesEndRef={messagesEndRef} />
    </>
  );
};

export default UserMessage;
