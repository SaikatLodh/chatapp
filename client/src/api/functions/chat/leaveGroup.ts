import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";

export const leavegroup = async (chatId: string) => {
  const response = await axiosInstance.get(
    `${endpoints.chat.leavegroup}/${chatId}`
  );
  return response.data;
};
