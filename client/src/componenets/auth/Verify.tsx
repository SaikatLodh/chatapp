import React from "react";
import OtpInput from "react-otp-input";
import { Box, Typography, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { resetLoading, verifyOtp } from "@/store/auth/authSlice";
import { useRouter } from "next/navigation";
import Resendtimer from "./Resendtimer";

interface OtpFormInputs {
  otp: string;
}

const Verify = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { email, loading } = useSelector((state: RootState) => state.auth);
  const { handleSubmit, control, formState, watch } = useForm<OtpFormInputs>({
    defaultValues: { otp: "" },
  });
  const otpValue = watch("otp");

  const onSubmit = (data: OtpFormInputs) => {
    dispatch(verifyOtp({ email: email as string, otp: Number(data.otp) }))
      .then((res) => {
        if (res?.payload?.message) {
          router.push("/register");
        }
      })
      .finally(() => {
        dispatch(resetLoading());
      });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      width={"100%"}
    >
      <Typography variant="h5" mb={2}>
        Enter OTP
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="otp"
          control={control}
          rules={{
            required: "OTP is required",
            pattern: {
              value: /^\d{4}$/,
              message: "OTP must be 4 digits",
            },
          }}
          render={({ field, fieldState }) => (
            <>
              <OtpInput
                value={field.value}
                onChange={(value) => {
                  if (/^\d*$/.test(value)) field.onChange(value);
                }}
                numInputs={4}
                inputType="tel"
                renderSeparator={<span style={{ width: 8 }}></span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    style={{
                      width: "3rem",
                      height: "3rem",
                      margin: "0 0.5rem",
                      fontSize: "2rem",
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      textAlign: "center",
                      background: "#fff",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                )}
              />
              {fieldState.error && (
                <Typography color="error" mt={1} fontSize="0.9rem">
                  {fieldState.error.message}
                </Typography>
              )}
            </>
          )}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: "#ea7070",
            width: "100%",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
          disabled={
            formState.isSubmitting ||
            !!formState.errors.otp ||
            otpValue.length !== 4 ||
            loading
          }
        >
          Verify
        </Button>
      </form>
      <Resendtimer />
    </Box>
  );
};

export default Verify;
