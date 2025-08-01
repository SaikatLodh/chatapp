import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";

export const addmembers = async (data: {
  chatId: string;
  members: string[];
}) => {
  const response = await axiosInstance.patch(endpoints.chat.addmembers, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
