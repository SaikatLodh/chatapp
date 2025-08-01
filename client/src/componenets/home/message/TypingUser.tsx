import { START_TYPING, STOP_TYPING } from "@/socketkeys/socketKeys";
import { RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const TypingUser = ({
  content,
  isTyping,
  setIsTyping,
  typingTimeoutRef,
  filterMe,
  filterOther,
  typingUser,
}: {
  content: string;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  typingTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  filterMe: string[] | undefined;
  filterOther: string[] | undefined;
  typingUser:
    | {
        _id: string;
        name: string;
        avatar?:
          | {
              url: string;
              public_id: string;
            }
          | undefined;
        gooleavatar?: string | undefined;
      }[]
    | undefined;
}) => {
  const { socket } = useSelector((state: RootState) => state.socket);
  useEffect(() => {
    if (content) {
      setIsTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
  }, [content, setIsTyping, typingTimeoutRef]);

  useEffect(() => {
    if (isTyping === true) {
      socket?.emit(START_TYPING, { filterMe, filterOther });
    }

    if (isTyping === false) {
      socket?.emit(STOP_TYPING, { filterMe, filterOther });
    }
  }, [socket, isTyping, filterMe, filterOther]);

  return (
    <>
      {typingUser && typingUser.length > 0
        ? typingUser.map((user) => (
            <div key={user._id}>{user.name} is typing</div>
          ))
        : null}
    </>
  );
};

export default TypingUser;
