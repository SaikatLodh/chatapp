import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Stack,
  Container,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React from "react";
import { useChangePassword } from "@/hooks/react-query/react-hooks/user/userHook";

type IFormInput = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const UserPassword = () => {
  const { mutate, isPending } = useChangePassword();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<IFormInput>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const newPasswordValue = watch("newPassword");

  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    mutate(data);
    reset();
  };

  return (
    <>
      <Container maxWidth="xs">
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 3, width: "100%" }}
          >
            <Stack spacing={2}>
              <Controller
                name="oldPassword"
                control={control}
                rules={{ required: "Old password is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showOldPassword ? "text" : "password"}
                    label="Old Password"
                    fullWidth
                    required
                    error={!!errors.oldPassword}
                    helperText={errors.oldPassword?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle old password visibility"
                            onClick={() => setShowOldPassword((show) => !show)}
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                          >
                            {showOldPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Controller
                name="newPassword"
                control={control}
                rules={{
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                  maxLength: {
                    value: 30,
                    message: "Password must be at most 30 characters long",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showNewPassword ? "text" : "password"}
                    label="New Password"
                    fullWidth
                    required
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle new password visibility"
                            onClick={() => setShowNewPassword((show) => !show)}
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                          >
                            {showNewPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === newPasswordValue || "The passwords do not match",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirm New Password"
                    fullWidth
                    required
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={() =>
                              setShowConfirmPassword((show) => !show)
                            }
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#EA7070",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#d65c5c",
                  },
                }}
                disabled={isPending}
              >
                Update Password
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default UserPassword;
