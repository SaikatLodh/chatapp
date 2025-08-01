import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";
import { Message } from "@/type";

export const getmessages = async (id: string): Promise<Message[]> => {
  const response = await axiosInstance.get(
    `${endpoints.chat.getmessages}/${id}`
  );

  return response.data.data.messages as Message[];
};
