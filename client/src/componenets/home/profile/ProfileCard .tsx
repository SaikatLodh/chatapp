import { Stack, Typography } from "@mui/material";
import React, { ReactNode } from "react";

interface ProfileCardProps {
  text: string | undefined;
  Icon?: ReactNode;
  heading: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ text, Icon, heading }) => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"1rem"}
      color={"white"}
      textAlign={"center"}
    >
      {Icon && Icon}

      <Stack>
        <Typography variant="body1">{text}</Typography>
        <Typography color={"gray"} variant="caption">
          {heading}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default ProfileCard;
