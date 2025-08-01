import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";

export const removefriend = async (friendId: string) => {
  const response = await axiosInstance.get(
    `${endpoints.user.removefriend}/${friendId}`
  );
  return response.data;
};
