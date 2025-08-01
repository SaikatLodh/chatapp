import { ListItem, Stack, Typography, Skeleton } from "@mui/material";
import React from "react";

const SkeletonLoader = () => {
  return (
    <>
      {Array(4)
        .fill(null)
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
                width={200}
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
                <Skeleton variant="text" width={"100%"} />
              </Typography>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1}
              >
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={36}
                  sx={{ borderRadius: 2 }}
                />
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={36}
                  sx={{ borderRadius: 2 }}
                />
              </Stack>
            </Stack>
          </ListItem>
        ))}
    </>
  );
};

export default SkeletonLoader;
