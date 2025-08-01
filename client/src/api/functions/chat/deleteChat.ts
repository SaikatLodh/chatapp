import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";

export const deleteChat = async (chatId: string) => {
  const response = await axiosInstance.delete(
    `${endpoints.chat.deleteChat}/${chatId}`
  );
  return response.data;
};
