import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  USER_CHAT_QUERY_KEY,
  USER_GROUP_QUERY_KEY,
  USER_MESSAGE_QUERY_KEY,
} from "../../react-keys/queryKeys";
import { getmychatlist } from "@/api/functions/chat/getChatList";
import { createGroup } from "@/api/functions/chat/createGroup";
import toast from "react-hot-toast";
import axios from "axios";
import { useGlobalHooks } from "@/hooks/globalHooks";
import { getMyFroups } from "@/api/functions/chat/getMyFroups";
import { getmessages } from "@/api/functions/chat/getMyMessage";
import { sendmessage } from "@/api/functions/chat/sendMessage";
import { renamegroup } from "@/api/functions/chat/renameGroup";
import { removemembers } from "@/api/functions/chat/removeMembers";
import { leavegroup } from "@/api/functions/chat/leaveGroup";
import { addmembers } from "@/api/functions/chat/addMemebers";
import { deleteChat } from "@/api/functions/chat/deleteChat";
import {
  removeMembers,
  updatememebers,
  updateName,
} from "@/store/chat/chatSlice";

const useChatList = () => {
  return useInfiniteQuery({
    queryKey: [USER_CHAT_QUERY_KEY],
    queryFn: getmychatlist,
    initialPageParam: 0,
    getNextPageParam: () => undefined,
  });
};

const useCreateGroup = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      if (data?.message) {
        toast.success(data?.message);
        queryClient.invalidateQueries({
          queryKey: [USER_CHAT_QUERY_KEY],
        });
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message?.name) {
          toast.error(error?.response?.data?.message?.name);
        } else if (error?.response?.data?.message?.members) {
          toast.error(error?.response?.data?.message?.members);
        } else if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        }
      }
    },
  });
};

const useGroupList = () => {
  return useQuery({
    queryKey: [USER_GROUP_QUERY_KEY],
    queryFn: getMyFroups,
  });
};

const useRenameGeroup = () => {
  const { queryClient, dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: renamegroup,
    onSuccess: (data, variables: { id: string; name: string }) => {
      console.log(data, variables);
      if (data?.message) {
        toast.success(data?.message);
        queryClient.invalidateQueries({
          queryKey: [USER_GROUP_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: [USER_CHAT_QUERY_KEY],
        });
        dispatch(updateName(variables.name));
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message?.name) {
          toast.error(error?.response?.data?.message?.name);
        } else if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        }
      }
    },
  });
};

const useAddMembers = () => {
  const { queryClient, dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: addmembers,
    onSuccess: (data, variables: { chatId: string; members: string[] }) => {
      if (data?.message) {
        queryClient.invalidateQueries({
          queryKey: [USER_GROUP_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: [USER_CHAT_QUERY_KEY],
        });
        const result = queryClient.getQueriesData([USER_CHAT_QUERY_KEY]);
        result.forEach((item: any) =>
          item[1]?.friends?.forEach((friend: any) => {
            if (friend._id === variables.members[0]) {
              dispatch(updatememebers(friend));
            }
          })
        );
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message?.chatId) {
          toast.error(error?.response?.data?.message?.chatId);
        } else if (error?.response?.data?.message?.members) {
          toast.error(error?.response?.data?.message?.members);
        } else if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        }
      }
    },
  });
};

const useRemoveMembers = () => {
  const { queryClient, dispatch } = useGlobalHooks();
  return useMutation({
    mutationFn: removemembers,
    onSuccess: (data, variables: { chatId: string; members: string[] }) => {
      console.log(variables);
      if (data?.message) {
        queryClient.invalidateQueries({
          queryKey: [USER_GROUP_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: [USER_CHAT_QUERY_KEY],
        });
        dispatch(removeMembers(variables.members[0]));
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error?.response?.data?.message?.chatId) {
          toast.error(error?.response?.data?.message?.chatId);
        } else if (error?.response?.data?.message?.members) {
          toast.error(error?.response?.data?.message?.members);
        } else if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        }
      }
    },
  });
};

const useLeaveGroup = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: leavegroup,
    onSuccess: (data) => {
      if (data?.message) {
        queryClient.invalidateQueries({
          queryKey: [USER_GROUP_QUERY_KEY],
        });
        queryClient.invalidateQueries({
          queryKey: [USER_CHAT_QUERY_KEY],
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

const useSendMessage = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: sendmessage,
    onSuccess: (data) => {
      if (data?.message) {
        queryClient.invalidateQueries({
          queryKey: [USER_MESSAGE_QUERY_KEY],
        });
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (typeof error?.response?.data?.message === "string") {
          toast.error(error?.response?.data?.message);
        } else if (
          typeof error?.response?.data?.message?.content === "string"
        ) {
          toast.error(error?.response?.data?.message?.content);
        }
      }
    },
  });
};

const useGetMessage = (id: string) => {
  return useQuery({
    queryKey: [USER_MESSAGE_QUERY_KEY, id],
    queryFn: () => getmessages(id),
  });
};

const useDeleteChat = (id: string) => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: () => deleteChat(id),
    onSuccess: (data) => {
      if (data?.message) {
        toast.error(data?.message);
        queryClient.invalidateQueries({
          queryKey: [USER_MESSAGE_QUERY_KEY, id],
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
  useChatList,
  useCreateGroup,
  useGroupList,
  useRenameGeroup,
  useAddMembers,
  useRemoveMembers,
  useLeaveGroup,
  useSendMessage,
  useGetMessage,
  useDeleteChat,
};
