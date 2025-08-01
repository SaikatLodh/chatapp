import { resetLoading, sendOtp } from "@/store/auth/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Box, Button } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Resendtimer = () => {
  const [timer, setTimer] = React.useState(120);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const { email, loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    if (timer > 0) {
      setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      setIsDisabled(false);
    }
  }, [timer]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleResend = () => {
    if (!email || email.trim() === "") {
      toast.error("Email is null, undefined, or empty. Cannot resend OTP.");
      return;
    }
    dispatch(sendOtp(email as string))
      .then((res) => {
        if (res?.payload?.message) {
          setIsDisabled(true);
          setTimer(120);
        }
      })
      .finally(() => {
        dispatch(resetLoading());
      });
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          mt: 2,
        }}
      >
        <h4>Didn’t received yet ?</h4>
        {isDisabled ? (
          <Button sx={{ color: "black" }}>
            {`Resend it in ${formatTime(timer)}`}
          </Button>
        ) : (
          <Button
            onClick={handleResend}
            disabled={isDisabled || loading}
            sx={{ color: "black" }}
          >
            Resend Email
          </Button>
        )}
      </Box>
    </>
  );
};

export default Resendtimer;
