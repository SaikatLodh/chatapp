import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import toast from "react-hot-toast";
import { ChatList } from "@/type";
import { AxiosProgressEvent } from "axios";
import { UseMutationResult } from "@tanstack/react-query";

const AudioSpeach = ({
  isSpeach,
  setIsSpeach,
  chatData,
  mutate,
}: {
  isSpeach: boolean;
  setIsSpeach: (value: boolean) => void;
  chatData: ChatList | null;
  mutate: UseMutationResult<
    unknown,
    unknown,
    {
      data: FormData;
      id: string;
      onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
    },
    unknown
  >["mutate"];
}) => {
  const handleClose = () => {
    setIsSpeach(false);
  };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startListen = () => {
    SpeechRecognition.startListening();
  };

  const sendMessage = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser does not support speech recognition.");
      return null;
    }
    const formdata = new FormData();
    formdata.append("content", transcript);
    formdata.append("isGroup", chatData?.groupChat.toString() as string);
    mutate(
      { data: formdata, id: chatData?._id as string },
      {
        onSuccess: () => {
          setIsSpeach(false);
        },
      }
    );
  };

  return (
    <React.Fragment>
      <Dialog
        open={isSpeach}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" textAlign={"center"}>
          Speak
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            textAlign={"center"}
            sx={{
              border: "1px solid black",
              padding: "20px 0px",
            }}
          >
            {transcript}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetTranscript} disabled={!transcript}>
            Reset Message
          </Button>
          <Button onClick={startListen} disabled={listening}>
            {listening ? "Listening..." : "Start Listening"}
          </Button>
          <Button disabled={!transcript || listening} onClick={sendMessage}>
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AudioSpeach;
