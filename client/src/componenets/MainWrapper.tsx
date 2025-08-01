"use client";
import io from "socket.io-client";
import { setChat, setGroup } from "@/store/chat/chatSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CREATE_CHAT,
  MESSAGE_ALERT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
  USERS_MESSAGE,
  USERS_REQUEST,
} from "@/socketkeys/socketKeys";
import {
  resetOnlineOfflineUser,
  setOnlineOfflineUser,
} from "@/store/websocket/onlineofflineUserSlice";
import { getUser, refreshToken, reSetDetails } from "@/store/auth/authSlice";
import { ChatList, FriendRequestNotification, Message } from "@/type";
import { useQueryClient } from "@tanstack/react-query";
import {
  USER_CHAT_QUERY_KEY,
  USER_MESSAGE_QUERY_KEY,
  USER_NOTIFICATION_QUERY_KEY,
} from "@/hooks/react-query/react-keys/queryKeys";
import {
  resetAllMessageAlert,
  setMessageAlert,
} from "@/store/websocket/messageAlertSlice";
import { resetSocket, setSocket } from "@/store/websocket/storeSocketDetailes";
import {
  removeTyping,
  resetTyping,
  setTyping,
} from "@/store/websocket/typingSlice";
import { useRouter } from "next/navigation";
import { initRefreshToken } from "@/api/functions/auth/refreshToken";
import Image from "next/image";
import * as motion from "motion/react-client";
const MainWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    initRefreshToken();
  }, []);
  useEffect(() => {
    dispatch(refreshToken()).then((res) => {
      if (res.payload.status === 200) {
        dispatch(getUser());
        router.push("/admin");
      }
    });
  }, [dispatch, router]);

  useEffect(() => {
    if (!isAuthenticated && !user) {
      return;
    }

    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      dispatch(setSocket(socket));

      socket.on(ONLINE_USERS, (users: string[]) => {
        dispatch(setOnlineOfflineUser(users));
      });

      socket.on(USERS_MESSAGE, (newMessage: Message) => {
        queryClient.setQueryData(
          [USER_MESSAGE_QUERY_KEY, newMessage.chat],
          (oldData: Message[] = []) => {
            return [...oldData, newMessage];
          }
        );
      });

      socket.on(USERS_REQUEST, (request: FriendRequestNotification) => {
        queryClient.setQueryData(
          [USER_NOTIFICATION_QUERY_KEY],
          (oldData: FriendRequestNotification[] = []) => {
            return [request, ...oldData];
          }
        );
      });

      socket.on(CREATE_CHAT, (chatList: ChatList) => {
        console.log(chatList);
        queryClient.setQueryData(
          [USER_CHAT_QUERY_KEY],
          (oldData: Message[] = []) => {
            return [chatList, ...oldData];
          }
        );
      });

      socket.on(MESSAGE_ALERT, (message: { chatId: string }) => {
        dispatch(setMessageAlert(message.chatId));
      });

      socket?.on(START_TYPING, (data: string[]) => {
        dispatch(setTyping(data));
      });

      socket.on(STOP_TYPING, (data: string[]) => {
        dispatch(removeTyping(data));
      });
    });

    socket.on("disconnect", () => {
      dispatch(resetSocket());
      dispatch(resetTyping());
    });

    socket.on("connect_error", (error) => {
      if (error) {
        dispatch(resetSocket());
        dispatch(reSetDetails());
        dispatch(setChat(null));
        dispatch(setGroup(null));
        dispatch(resetOnlineOfflineUser());
        dispatch(resetAllMessageAlert());
        dispatch(resetTyping());
      }
    });

    return () => {
      dispatch(setChat(null));
      dispatch(setGroup(null));
    };
  }, [dispatch, isAuthenticated, user, queryClient]);

  return (
    <>
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        whileInView={{ opacity: 0, scale: 0 }}
        transition={{ delay: 9, duration: 2, ease: "easeInOut" }}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          position: "fixed",
          zIndex: "1000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src="/9bc07b632c7ca8a2e20d011ab58aa3f7.gif"
          alt="profile"
          width={500}
          height={500}
        />
      </motion.div>
      {children}
    </>
  );
};

export default MainWrapper;
