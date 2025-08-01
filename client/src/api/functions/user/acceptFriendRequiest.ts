import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";

export const acceptFriendRequest = async (data: {
  senderId: string;
  accept: boolean;
}) => {
  const response = await axiosInstance.post(
    endpoints.user.acceptfriendrequest,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
