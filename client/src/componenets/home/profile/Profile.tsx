import { Avatar, Stack } from "@mui/material";
import React from "react";
import ProfileCard from "./ProfileCard ";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import moment from "moment";
const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
        <Avatar
          src={user?.avatar?.url || user?.gooleavatar}
          sx={{
            width: 200,
            height: 200,
            objectFit: "cover",
            marginBottom: "1rem",
            border: "5px solid white",
          }}
        />
        {user?.bio && user?.bio?.length > 0 && (
          <ProfileCard heading={"Bio"} text={user?.bio} />
        )}
        <ProfileCard
          heading={"Username"}
          text={user?.username}
          Icon={<UserNameIcon />}
        />
        <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon />} />
        <ProfileCard
          heading={"Joined"}
          text={moment(user?.createdAt).format("MMM Do YYYY")}
          Icon={<CalendarIcon />}
        />
      </Stack>
    </>
  );
};

export default Profile;
