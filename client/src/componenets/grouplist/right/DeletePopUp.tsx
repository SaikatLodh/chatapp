import { useLeaveGroup } from "@/hooks/react-query/react-hooks/chat/chatHook";
import { GroupList } from "@/type";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import React from "react";

const DeletePopUp = ({
  open,
  handleClose,
  groupData
}: {
  open: boolean;
  handleClose: () => void;
  groupData: GroupList
}) => {
  const { mutate } = useLeaveGroup();
  const handleDelete = () => {
    mutate(groupData._id, {
      onSuccess: () => {
        handleClose();
      },
    });
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to leave this group
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleDelete} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeletePopUp;
