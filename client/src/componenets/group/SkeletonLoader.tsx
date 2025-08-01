import { ListItem, Stack, Typography } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import React from "react";

const SkeletonLoader = () => {
  return (
    <>
      {Array(2)
        .fill(0)
        .map((_, index) => (
          <ListItem key={index}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              spacing={"1rem"}
              width={"100%"}
            >
              <Skeleton
                variant="circular"
                width={90}
                height={50}
                sx={{ objectFit: "cover" }}
              />
              <Typography
                variant="body1"
                sx={{
                  flexGlow: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.8rem",
                  }}
                >
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={100}
                    height={20}
                  />
                </Typography>
              </Typography>

              <Skeleton
                variant="text"
                sx={{ fontSize: "1rem" }}
                width={100}
                height={20}
              />
            </Stack>
          </ListItem>
        ))}
    </>
  );
};

export default SkeletonLoader;
