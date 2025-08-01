import { forgotSendEmail, resetLoading } from "@/store/auth/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface ForgotEmailFormInputs {
  email: string;
}

const ForgotSendEmail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const { handleSubmit, control } = useForm<ForgotEmailFormInputs>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotEmailFormInputs> = (data) => {
    dispatch(forgotSendEmail(data.email)).finally(() => {
      dispatch(resetLoading());
    });
  };

  return (
    <>
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Forgot Password</Typography>
          <form
            style={{
              width: "100%",
              marginTop: "1rem",
            }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Email"
                  margin="normal"
                  variant="outlined"
                  type="email"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Button
              sx={{
                marginTop: "1rem",
                backgroundColor: "#ea7070",
              }}
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
            >
              Send Reset Email
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default ForgotSendEmail;
