import { Box, Typography, Skeleton } from "@mui/material";
import React from "react";

const SkeletonLoader = () => {
  return (
    <>
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 2,
              borderBottom: "1px solid #ccc",
              gap: 2,
              width: "100%",
            }}
            key={index}
          >
            <Skeleton
              variant="circular"
              width={90}
              height={60}
              sx={{ objectFit: "cover" }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Box>
                <Typography variant="body1">
                  {" "}
                  <Skeleton variant="text" width={200} />
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <Skeleton variant="text" width={200} />
                </Typography>
              </Box>
            </Box>

            <Skeleton
              variant="rectangular"
              width={80}
              height={36}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        ))}
    </>
  );
};

export default SkeletonLoader;
