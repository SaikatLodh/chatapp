import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";

const sendFriendRequest = async (receiverId: string) => {
  const response = await axiosInstance.get(
    `${endpoints.user.sendfriendrequest}/${receiverId}`
  );
  return response.data;
};

export default sendFriendRequest;
