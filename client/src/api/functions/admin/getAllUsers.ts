import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";
import { User } from "@/type";

export const getallusers = async (): Promise<User[]> => {
  const response = await axiosInstance.get(endpoints.admin.getallusers);
  return response.data.data.users as User[];
};
