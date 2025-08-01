import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Container,
  Box,
  Avatar,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useUpdateUser } from "@/hooks/react-query/react-hooks/user/userHook";

interface IFormInput {
  name: string;
  username: string;
  bio: string;
  profilePic: FileList;
}

const Account = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { mutate, isPending } = useUpdateUser();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  const [previewPic, setPreviewPic] = useState<string>("");

  const profilePicValue = watch("profilePic");
  if (profilePicValue && profilePicValue.length > 0) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewPic(reader.result as string);
    };
    reader.readAsDataURL(profilePicValue[0]);
  }

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("bio", data.bio);
    if (profilePicValue && profilePicValue.length > 0) {
      formData.append("profilePic", profilePicValue[0]);
    }
    mutate(formData);
  };

  return (
    <>
      <Container maxWidth="sm">
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            src={
              previewPic
                ? previewPic
                : user?.avatar
                ? user.avatar.url
                : user?.gooleavatar
                ? user.gooleavatar
                : ""
            }
            sx={{ width: 150, height: 150, mb: 3 }}
          />

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <Stack spacing={2}>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="username"
                control={control}
                rules={{
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Username"
                    fullWidth
                    required
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                )}
              />

              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bio"
                    fullWidth
                    multiline
                    rows={4}
                  />
                )}
              />

              <Controller
                name="profilePic"
                control={control}
                render={({ field: { onChange, onBlur, name, ref } }) => (
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    disabled={user?.gooleavatar ? true : false}
                    sx={{
                      backgroundColor: "#EA7070",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#d65c5c",
                      },
                    }}
                  >
                    Upload Profile Picture
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      hidden
                      onChange={(e) => onChange(e.target.files)}
                      onBlur={onBlur}
                      name={name}
                      ref={ref}
                    />
                  </Button>
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
                Save Profile
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Account;
