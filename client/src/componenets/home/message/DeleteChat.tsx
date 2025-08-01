import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useDeleteChat } from "@/hooks/react-query/react-hooks/chat/chatHook";

const DeleteChat = ({
  openDelete,
  setOpenDelete,
  id,
}: {
  openDelete: boolean;
  setOpenDelete: (value: boolean) => void;
  id: string;
}) => {
  const { mutate } = useDeleteChat(id);
  const handleClose = () => {
    setOpenDelete(false);
  };
  return (
    <React.Fragment>
      <Dialog
        open={openDelete}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Do you want to delete this chat ?
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={() => mutate()} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DeleteChat;
