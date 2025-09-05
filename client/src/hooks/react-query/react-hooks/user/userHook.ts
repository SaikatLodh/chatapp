import { useQuery, useMutation } from "@tanstack/react-query";
import {
  USER_CHAT_QUERY_KEY,
  USER_FRIENDS_QUERY_KEY,
  USER_LIST_QUERY_KEY,
  USER_MESSAGE_QUERY_KEY,
  USER_NOTIFICATION_QUERY_KEY,
} from "../../react-keys/queryKeys";
import searchUser from "../../../../api/functions/user/searchUser";
import sendFriendRequest from "@/api/functions/user/sendFriendRequiest";
import axios from "axios";
import toast from "react-hot-toast";
import { useGlobalHooks } from "@/hooks/globalHooks";
import { getmyfrieendrequest } from "@/api/functions/user/getUserNotification";
import { acceptFriendRequest } from "@/api/functions/user/acceptFriendRequiest";
import { removefriend } from "@/api/functions/user/removeFriend";
import { updateuser } from "@/api/functions/user/updateUser";
import { getUser } from "@/store/auth/authSlice";
import { changepassword } from "@/api/functions/user/changePassword";
import { getmyfriends } from "@/api/functions/user/getmyFriends";

const useUpdateUser = () => {
  const { dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: updateuser,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
        dispatch(getUser());
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message?.name) {
          toast.error(error?.response?.data?.message?.name);
        } else if (error?.response?.data?.message?.bio) {
          toast.error(error?.response?.data?.message?.bio);
        } else if (error?.response?.data?.message?.username) {
          toast.error(error?.response?.data?.message?.username);
        } else if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        }
      }
    },
  });
};

const useChangePassword = () => {
  return useMutation({
    mutationFn: changepassword,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message?.oldPassword) {
          toast.error(error?.response?.data?.message?.oldPassword);
        } else if (error?.response?.data?.message?.newPassword) {
          toast.error(error?.response?.data?.message?.newPassword);
        } else if (error?.response?.data?.message?.confirmPassword) {
          toast.error(error?.response?.data?.message?.confirmPassword);
        } else if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        }
      }
    },
  });
};

const useSearchUser = (searchTerm: string) => {
  return useQuery({
    queryKey: [USER_LIST_QUERY_KEY, searchTerm],
    queryFn: () => searchUser(searchTerm),
  });
};

const useSendFriendRequest = (receiverId: string) => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: () => sendFriendRequest(receiverId),
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
        queryClient.invalidateQueries({
          queryKey: [USER_LIST_QUERY_KEY],
        });
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        }
      }
    },
  });
};

const useAcceptFriendRequest = () => {
  const { queryClient } = useGlobalHooks();

  return useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);

        queryClient.invalidateQueries({ queryKey: [USER_LIST_QUERY_KEY] });
        queryClient.invalidateQueries({
          queryKey: [USER_NOTIFICATION_QUERY_KEY],
        });
        queryClient.invalidateQueries({ queryKey: [USER_CHAT_QUERY_KEY] });
        queryClient.invalidateQueries({ queryKey: [USER_FRIENDS_QUERY_KEY] });
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        }
      }
    },
  });
};

const useMyFriendsRequest = () => {
  return useQuery({
    queryKey: [USER_NOTIFICATION_QUERY_KEY],
    queryFn: getmyfrieendrequest,
  });
};

const useGetmyFriends = () => {
  return useQuery({
    queryKey: [USER_FRIENDS_QUERY_KEY],
    queryFn: getmyfriends,
  });
};

const useRemovefriend = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: removefriend,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
        queryClient.invalidateQueries({
          queryKey: [USER_LIST_QUERY_KEY],
        });

        queryClient.invalidateQueries({
          queryKey: [USER_FRIENDS_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: [USER_CHAT_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: [USER_MESSAGE_QUERY_KEY],
        });
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        }
      }
    },
  });
};

export {
  useUpdateUser,
  useChangePassword,
  useSearchUser,
  useSendFriendRequest,
  useAcceptFriendRequest,
  useMyFriendsRequest,
  useGetmyFriends,
  useRemovefriend,
};
