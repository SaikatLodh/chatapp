import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { GroupList } from "@/type";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRenameGeroup } from "@/hooks/react-query/react-hooks/chat/chatHook";

type Inputs = {
  email: string;
};

const EditePoup = ({
  open,
  setOpen,
  groupData,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  groupData: GroupList;
}) => {
  const { mutate } = useRenameGeroup();
  const handleClose = () => {
    setOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    mutate(
      { name: data.email, id: groupData?._id as string },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: "center" }}>
          {groupData?.name}
        </DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Enter Name"
              type="text"
              fullWidth
              variant="standard"
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default EditePoup;
