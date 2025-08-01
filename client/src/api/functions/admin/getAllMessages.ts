import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";
import { AdminChatMessage } from "@/type";

export const getallmessages = async (): Promise<AdminChatMessage[]> => {
  const response = await axiosInstance.get(endpoints.admin.getallmessages);
  return response.data.data.messages as AdminChatMessage[];
};
