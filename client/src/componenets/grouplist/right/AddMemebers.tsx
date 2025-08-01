import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import React from "react";
import { useGetmyFriends } from "@/hooks/react-query/react-hooks/user/userHook";
import { GroupList } from "@/type";
import FriendsList from "./FriendsList";
import { useAddMembers } from "@/hooks/react-query/react-hooks/chat/chatHook";

const AddMemebers = ({
  openGroup,
  closeGroupHandler,
  groupData,
}: {
  openGroup: boolean;
  closeGroupHandler: () => void;
  groupData: GroupList;
}) => {
  const { mutate } = useAddMembers();
  const { data } = useGetmyFriends();
  const [friends, setFriends] = React.useState<string[]>([]);
  const spreadData = [...(groupData.members || []), ...(data?.friends || [])];

  const memberIds = new Set(groupData.members?.map((member) => member._id));

  const getFilterFriends = spreadData.filter(
    (friend) => !memberIds.has(friend._id)
  );

  const addMembers = (friendId: string) => {
    if (friends.includes(friendId)) {
      setFriends((prev) => prev.filter((id) => id !== friendId));
    } else {
      setFriends((prev) => [...prev, friendId]);
    }
  };

  const onSubmitHandler = () => {
    const payload = {
      chatId: groupData._id,
      members: friends,
    };

    mutate(payload, {
      onSuccess: () => closeGroupHandler(),
    });
  };

  return (
    <>
      <Dialog open={openGroup} onClose={closeGroupHandler}>
        <Stack
          p={{ xs: "1rem", sm: "3rem" }}
          width={"25rem"}
          maxHeight={"520px"}
          overflow={"auto"}
          spacing={"2rem"}
        >
          <DialogTitle textAlign={"center"} variant="h4">
            Add Members
          </DialogTitle>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            Friends
          </Typography>

          <Stack>
            {getFilterFriends && getFilterFriends?.length > 0 ? (
              getFilterFriends.map((friend) => (
                <FriendsList
                  key={friend._id}
                  data={friend}
                  friends={friends}
                  addMembers={addMembers}
                />
              ))
            ) : (
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                No friends found
              </Typography>
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
              disabled={friends.length === 0}
              sx={{ backgroundColor: "#EA7070" }}
              onClick={onSubmitHandler}
            >
              Add
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default AddMemebers;
