import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { getUser, googlesignin, resetLoading } from "@/store/auth/authSlice";

const SigninGoogle = () => {
  const dispatch = useDispatch<AppDispatch>();

  const responseGoogle = async (authResult: {
    authuser?: string;
    code?: string;
    prompt?: string;
    scope?: string;
    error?: string;
  }) => {
    try {
      if (authResult["code"]) {
        dispatch(googlesignin(authResult.code))
          .then((res) => {
            if (res?.payload?.message) {
              window.location.href = "/";
              dispatch(getUser());
            }
          })
          .finally(() => {
            dispatch(resetLoading());
          });
      }
    } catch (error) {
      console.log("Error while Google Login...", error);
    }
  };
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <Button
      variant="contained"
      startIcon={<GoogleIcon />}
      sx={{
        marginTop: "1rem",
        backgroundColor: "#ea7070",
        width: "100%",
      }}
      onClick={googleLogin}
    >
      Sign in with Google
    </Button>
  );
};

export default SigninGoogle;
