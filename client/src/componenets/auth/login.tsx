"use client";
import GoogleLoginWrapper from "@/googleauth/GoogleLoginWrapper";
import { getUser, login, resetLoading } from "@/store/auth/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const savedEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("savedEmail") || ""
      : "";

  const savedPassword =
    typeof window !== "undefined"
      ? localStorage.getItem("savedPassword") || ""
      : "";

  const { handleSubmit, control, setValue } = useForm<LoginFormInputs>({
    defaultValues: {
      email: savedEmail,
      password: savedPassword,
    },
  });

  useEffect(() => {
    if (savedEmail) {
      setValue("email", savedEmail);
      setValue("password", savedPassword);
      setRememberMe(true);
    }
  }, [savedEmail, savedPassword, setValue]);

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    dispatch(login(data))
      .then((res) => {
        if (res?.payload?.message) {
          localStorage.removeItem("accessToken");

          if (rememberMe) {
            localStorage.setItem("savedEmail", data.email);
            localStorage.setItem("savedPassword", data.password);
          } else {
            localStorage.removeItem("savedEmail");
            localStorage.removeItem("savedPassword");
          }

          window.location.href = "/";
          dispatch(getUser());
        }
      })
      .finally(() => {
        dispatch(resetLoading());
      });
  };

  return (
    <Container
      component={"main"}
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
        <Typography variant="h5">Login</Typography>
        <form
          style={{
            width: "100%",
            marginTop: "1rem",
          }}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          autoComplete="on"
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
                autoComplete="email"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
              maxLength: { value: 30, message: "Maximum 30 characters" },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                variant="outlined"
                autoComplete="current-password"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((show) => !show)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                color="primary"
              />
            }
            label="Remember Me"
          />

          <Button
            sx={{
              marginTop: "1rem",
              backgroundColor: "#ea7070",
            }}
            variant="contained"
            type="submit"
            fullWidth
            disabled={loading}
          >
            Login
          </Button>
        </form>

        <GoogleLoginWrapper />

        <Typography textAlign={"center"} mt={2}>
          OR
        </Typography>

        <Link href="/send-email">
          <Button fullWidth variant="text" sx={{ color: "#ea7070" }}>
            Sign Up Instead
          </Button>
        </Link>
        <Link href="/forgot-send-email">
          <Button fullWidth variant="text" sx={{ color: "#ea7070" }}>
            Forgot Password?
          </Button>
        </Link>
      </Paper>
    </Container>
  );
};

export default Login;
