import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";
import { ChatList } from "@/type";

export const getmychatlist = async (): Promise<ChatList[]> => {
  const response = await axiosInstance.get(endpoints.chat.getmychatlist);
  return response.data.data.chats as ChatList[];
};
