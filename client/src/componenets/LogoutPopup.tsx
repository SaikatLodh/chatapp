import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

const LogoutPopup = ({
  logoutOpen,
  setLogoutOpen,
  logoutHandler,
}: {
  logoutOpen: boolean;
  setLogoutOpen: (value: boolean) => void;
  logoutHandler: () => void;
}) => {
  const handleClose = () => {
    setLogoutOpen(false);
  };
  return (
    <>
      <React.Fragment>
        <Dialog
          open={logoutOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Do you want to logout ?
          </DialogTitle>

          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={logoutHandler} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
};

export default LogoutPopup;
