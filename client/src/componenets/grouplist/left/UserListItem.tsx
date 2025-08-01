import React from "react";
import { motion } from "framer-motion";
import { Avatar, Stack, AvatarGroup, Box, Typography } from "@mui/material";
import { GroupList } from "@/type";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setGroup } from "@/store/chat/chatSlice";
import { transformImage } from "@/features/features";

const UserListItem = ({ data }: { data: GroupList }) => {
  const { groupData } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <motion.div
      initial={{ opacity: 0, y: "-100%" }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * 0 }}
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        backgroundColor: groupData?._id === data._id ? "#EA7070" : "#262626",
        color: "white",
        position: "relative",
        padding: "1rem",
        cursor: "pointer",
        marginBottom: "1rem",
        borderRadius: "10px",
        marginRight: "1rem",
        marginLeft: "1rem",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        border: groupData?._id === data._id ? "3px solid white" : "none",
      }}
      onClick={() => dispatch(setGroup(data))}
    >
      <Stack direction={"row"} spacing={0.5}>
        <AvatarGroup
          max={4}
          sx={{
            position: "relative",
          }}
        >
          <Box width={"5rem"} height={"3rem"}>
            {data.avatar
              .map((i) => (typeof i === "string" && i ? i : ""))
              .map((i, index) => (
                <Avatar
                  key={index}
                  src={transformImage(i)}
                  alt={`Avatar ${index}`}
                  sx={{
                    width: "3rem",
                    height: "3rem",
                    position: "absolute",
                    left: {
                      xs: `${0.5 + index}rem`,
                      sm: `${index}rem`,
                    },
                  }}
                />
              ))}
          </Box>
        </AvatarGroup>
      </Stack>

      <Stack>
        <Typography>{data.name}</Typography>
        {/* {newMessageAlert && (
              <Typography>{newMessageAlert.count} New Message</Typography>
            )} */}
      </Stack>

      {/* {isOnline && (
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
          )} */}
    </motion.div>
  );
};

export default UserListItem;
