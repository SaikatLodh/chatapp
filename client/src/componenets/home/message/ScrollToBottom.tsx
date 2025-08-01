import { Message } from "@/type";
import { useEffect } from "react";

const ScrollToBottom = ({
  data,
  messagesEndRef,
}: {
  data: Message;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) => {
  useEffect(() => {
    if (data && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [data, messagesEndRef]);
  return null;
};

export default ScrollToBottom;
