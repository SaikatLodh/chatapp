import {
  Box,
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import UserItem from "./UserItem";
import { Search as SearchIcon } from "@mui/icons-material";
import { useSearchUser } from "@/hooks/react-query/react-hooks/user/userHook";
import { useDebounce } from "use-debounce";
import SkeletonLoader from "./SkeletonLoader";
const Search = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: (value: string) => void;
}) => {
  const [value, setValue] = useState("");
  const [valueDebounced] = useDebounce(value, 400);
  const { data, isLoading } = useSearchUser(valueDebounced);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <Stack
          p={"2rem"}
          direction={"column"}
          width={"25rem"}
          maxHeight={"520px"}
          overflow={"auto"}
        >
          <DialogTitle textAlign={"center"}>Find People</DialogTitle>
          <TextField
            label=""
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            placeholder="Search User"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <List>
            {isLoading ? (
              <SkeletonLoader />
            ) : data && data.length > 0 ? (
              data.map((user) => <UserItem key={user._id} user={user} />)
            ) : (
              <Box sx={{ textAlign: "center", mt: "20px" }}> No User Yet</Box>
            )}
          </List>
        </Stack>
      </Dialog>
    </>
  );
};

export default Search;
