import { Avatar, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useRemoveMembers } from "@/hooks/react-query/react-hooks/chat/chatHook";
import { GroupList } from "@/type";
import DeleteIcon from "@mui/icons-material/Delete";
import MembersList from "./MembersList";
import DeletePopUp from "./DeletePopUp";
import AddMemebers from "./AddMemebers";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Members = ({ groupData }: { groupData: GroupList }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { mutate } = useRemoveMembers();
  const [friends, setFriends] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openGroup, setOpenGroup] = React.useState(false);
  const filterData = groupData.members
    ?.filter((member) => member._id !== user?._id)
    .reverse();

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

    mutate(payload);
  };
  return (
    <>
      <Stack
        p={{ xs: "1rem", sm: "3rem" }}
        width={"25rem"}
        maxHeight={"550px"}
        overflow={"auto"}
        spacing={"2rem"}
      >
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Members
        </Typography>

        <Stack>
          <Avatar
            alt={user?.name}
            src={user?.avatar?.url || user?.gooleavatar}
            sx={{ width: "5rem", height: "5rem", margin: "auto" }}
          />
          <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
            You
          </Typography>
          {filterData && filterData.length > 0 ? (
            filterData.map((friend, index) => (
              <MembersList
                key={index}
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
            variant="contained"
            size="large"
            sx={{ backgroundColor: "#EA7070" }}
            type="submit"
            onClick={() => setOpenGroup(true)}
          >
            Add Members
          </Button>
          <Button
            variant="contained"
            size="large"
            disabled={friends.length === 0}
            sx={{ backgroundColor: "#EA7070" }}
            onClick={onSubmitHandler}
          >
            Remove
          </Button>
        </Stack>
        <Button
          variant="text"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{
            textTransform: "none",
            fontSize: "0.9rem",
            "& .MuiButton-startIcon": {
              marginRight: 0.5,
            },
          }}
          onClick={() => setOpen(true)}
        >
          LEAVE GROUP
        </Button>
        <DeletePopUp
          open={open}
          handleClose={() => setOpen(false)}
          groupData={groupData}
        />
        <AddMemebers
          openGroup={openGroup}
          closeGroupHandler={() => setOpenGroup(false)}
          groupData={groupData}
        />
      </Stack>
    </>
  );
};

export default Members;
