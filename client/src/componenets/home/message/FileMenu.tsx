import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import React, { useRef, useState } from "react";
import {
  AudioFile as AudioFileIcon,
  Image as ImageIcon,
  VideoFile as VideoFileIcon,
} from "@mui/icons-material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useSendMessage } from "@/hooks/react-query/react-hooks/chat/chatHook";
import ProgressBar from "./ProgressBar";
import toast from "react-hot-toast";
import { ChatList } from "@/type";

const FileMenu = ({
  open,
  handleClose,
  chatDetailes,
}: {
  open: boolean;
  handleClose: () => void;
  chatDetailes: ChatList | null;
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const { mutate } = useSendMessage();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 5)
      toast.error("You can only upload 5 files at a time.");
    if (!files || files.length === 0 || files.length > 5) return;

    const formData = new FormData();
    formData.append("isGroup", chatDetailes?.groupChat.toString() as string);
    Array.from(files).forEach((file) => formData.append("attechment", file));

    setUploading(true);
    mutate(
      {
        data: formData,
        id: chatDetailes?._id as string,
        onUploadProgress: (event: import("axios").AxiosProgressEvent) => {
          if (event.total) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        },
      },
      {
        onSettled: () => {
          setUploading(false);
          setProgress(0);
          handleClose();
        },
      }
    );
  };

  return (
    <>
      <Menu open={open} onClose={handleClose} sx={{ left: "20%", top: "-7%" }}>
        <div style={{ width: "10rem" }}>
          <MenuList>
            <MenuItem onClick={() => imageInputRef.current?.click()}>
              <Tooltip title="Image">
                <ImageIcon />
              </Tooltip>
              <ListItemText style={{ marginLeft: "0.5rem" }}>
                Image
              </ListItemText>
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/png, image/jpeg, image/gif, image/jpg"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </MenuItem>

            <MenuItem onClick={() => audioInputRef.current?.click()}>
              <Tooltip title="Audio">
                <AudioFileIcon />
              </Tooltip>
              <ListItemText style={{ marginLeft: "0.5rem" }}>
                Audio
              </ListItemText>
              <input
                ref={audioInputRef}
                type="file"
                multiple
                accept="audio/mpeg, audio/wav audio/ogg audio/mp3"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </MenuItem>

            <MenuItem onClick={() => videoInputRef.current?.click()}>
              <Tooltip title="Video">
                <VideoFileIcon />
              </Tooltip>
              <ListItemText style={{ marginLeft: "0.5rem" }}>
                Video
              </ListItemText>
              <input
                ref={videoInputRef}
                type="file"
                multiple
                accept="video/mp4, video/webm, video/ogg"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </MenuItem>

            <MenuItem onClick={() => pdfInputRef.current?.click()}>
              <Tooltip title="File">
                <PictureAsPdfIcon />
              </Tooltip>
              <ListItemText style={{ marginLeft: "0.5rem" }}>Pdf</ListItemText>
              <input
                ref={pdfInputRef}
                type="file"
                multiple
                accept="application/pdf,application/vnd.ms-excel"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </MenuItem>
            {uploading && <ProgressBar value={progress} />}
          </MenuList>
        </div>
      </Menu>
    </>
  );
};

export default FileMenu;
