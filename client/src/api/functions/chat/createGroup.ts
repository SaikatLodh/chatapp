import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";

export const createGroup = async (data: {
  name: string;
  members: string[];
}) => {
  const response = await axiosInstance.post(
    endpoints.chat.creategroupchat,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
