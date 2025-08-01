import { getallusers } from "@/api/functions/admin/getAllUsers";
import { useQuery } from "@tanstack/react-query";
import {
  ADMIN_CHAT_LIST_QUERY_KEY,
  ADMIN_DASHBOARD_STATUS_QUERY_KEY,
  ADMIN_MESSAGE_LIST_QUERY_KEY,
  ADMIN_USER_LIST_QUERY_KEY,
} from "../../react-keys/queryKeys";
import { getallchats } from "@/api/functions/admin/getAllChats";
import { getallmessages } from "@/api/functions/admin/getAllMessages";
import { getdashboardstats } from "@/api/functions/admin/getDashboardStats";

const useDashboardStatus = () => {
  return useQuery({
    queryKey: [ADMIN_DASHBOARD_STATUS_QUERY_KEY],
    queryFn: getdashboardstats,
  });
};

const useGetAllUsers = () => {
  return useQuery({
    queryKey: [ADMIN_USER_LIST_QUERY_KEY],
    queryFn: getallusers,
  });
};

const useGetAllChats = () => {
  return useQuery({
    queryKey: [ADMIN_CHAT_LIST_QUERY_KEY],
    queryFn: getallchats,
  });
};

const useGetMessages = () => {
  return useQuery({
    queryKey: [ADMIN_MESSAGE_LIST_QUERY_KEY],
    queryFn: getallmessages,
  });
};

export { useDashboardStatus, useGetAllUsers, useGetAllChats, useGetMessages };
