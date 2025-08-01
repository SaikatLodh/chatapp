import { AdminChats } from "@/type";
import { axiosInstance } from "../../axiosinstance/axiosinstance";
import endpoints from "../../endpoints/endpoints";

export const getallchats = async (): Promise<AdminChats[]> => {
  const response = await axiosInstance.get(endpoints.admin.getallchats);
  return response.data.data.chats as AdminChats[];
};
