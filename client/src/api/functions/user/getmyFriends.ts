import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";
import { Friends } from "@/type";

export const getmyfriends = async (): Promise<Friends> => {
  const response = await axiosInstance.get(endpoints.user.getmyfriends);
  return response.data.data.friends as Friends;
};
