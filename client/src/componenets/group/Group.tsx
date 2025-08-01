import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import UserItem from "./UserItem";
import { useGetmyFriends } from "@/hooks/react-query/react-hooks/user/userHook";
import { useForm } from "react-hook-form";
import { useCreateGroup } from "@/hooks/react-query/react-hooks/chat/chatHook";
import SkeletonLoader from "./SkeletonLoader";

interface GroupProps {
  name: string;
}

const Group = ({
  isGroup,
  closeGroupHandler,
}: {
  isGroup: boolean;
  closeGroupHandler: () => void;
}) => {
  const { data, isLoading } = useGetmyFriends();
  const { mutate } = useCreateGroup();
  const [friends, setFriends] = React.useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupProps>({
    defaultValues: {
      name: "",
    },
  });

  const addMembers = (friendId: string) => {
    if (friends.includes(friendId)) {
      setFriends((prev) => prev.filter((id) => id !== friendId));
    } else {
      setFriends((prev) => [...prev, friendId]);
    }
  };

  const onSubmitHandler = (data: { name: string }) => {
    const payload = {
      name: data.name,
      members: friends,
    };

    mutate(payload);
    closeGroupHandler();
  };
  return (
    <>
      <Dialog open={isGroup} onClose={closeGroupHandler}>
        <Stack
          p={{ xs: "1rem", sm: "3rem" }}
          width={"25rem"}
          maxHeight={"520px"}
          overflow={"auto"}
          spacing={"2rem"}
        >
          <DialogTitle textAlign={"center"} variant="h4">
            New Group
          </DialogTitle>
          <Box component="form" onSubmit={handleSubmit(onSubmitHandler)}>
            <TextField
              label="Group Name"
              disabled={!data || data?.friends.length <= 0}
              {...register("name", {
                required: {
                  value: true,
                  message: "Group name is required",
                },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              sx={{ marginBottom: "1rem" }}
            />

            <Typography variant="body1" sx={{ textAlign: "center" }}>
              Members
            </Typography>

            <Stack>
              {isLoading ? (
                <SkeletonLoader />
              ) : data && data?.friends.length > 0 ? (
                data?.friends.map((friend) => (
                  <UserItem
                    key={friend._id}
                    data={friend}
                    friends={friends}
                    addMembers={addMembers}
                  />
                ))
              ) : (
                <Box sx={{ textAlign: "center", my: "2rem" }}>
                  <Typography variant="body2" color="textSecondary">
                    You have No friends
                  </Typography>
                </Box>
              )}
            </Stack>

            <Stack direction={"row"} justifyContent={"space-evenly"}>
              <Button
                variant="text"
                color="error"
                size="large"
                onClick={closeGroupHandler}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="large"
                disabled={!data || data?.friends.length <= 0}
                sx={{ backgroundColor: "#EA7070" }}
                type="submit"
              >
                Create
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Dialog>
    </>
  );
};

export default Group;
