import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";
import { FriendRequestNotification } from "@/type";

export const getmyfrieendrequest = async (): Promise<
  FriendRequestNotification[]
> => {
  const response = await axiosInstance.get(endpoints.user.getmyfrieendrequest, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data.data.requests as FriendRequestNotification[];
};
