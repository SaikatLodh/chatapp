import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import GoogleSignupWrapper from "@/googleauth/GoogleSignupWrapper";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { resetLoading, sendOtp, setEmail } from "@/store/auth/authSlice";
import { useRouter } from "next/navigation";

interface SendEmailFormInputs {
  email: string;
}

const SendEmail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const { handleSubmit, control } = useForm<SendEmailFormInputs>();
  const router = useRouter();
  const onSubmit: SubmitHandler<SendEmailFormInputs> = (data) => {
    dispatch(sendOtp(data.email))
      .then((res) => {
        if (res?.payload?.message) {
          dispatch(setEmail(data.email));
          router.push("/verify-email");
        }
      })
      .finally(() => {
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
          <Typography variant="h5">Send Email</Typography>
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
              defaultValue=""
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
              Send
            </Button>

            <GoogleSignupWrapper />
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default SendEmail;
