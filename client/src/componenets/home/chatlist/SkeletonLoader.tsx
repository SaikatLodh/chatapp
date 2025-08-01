import { Box, Skeleton } from "@mui/material";
import React from "react";

const SkeletonLoader = () => {
  return (
    <>
      {Array(12)
        .fill(0)
        .map((_, index) => (
          <Box
            sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2, mx: 2 }}
            key={index}
          >
            <Skeleton
              variant="circular"
              width={50}
              height={50}
              sx={{ objectFit: "cover" }}
            />
            <Skeleton variant="text" width={200} />
          </Box>
        ))}
    </>
  );
};

export default SkeletonLoader;
