import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";
import { GroupList } from "@/type";

export const getMyFroups = async (): Promise<GroupList[]> => {
  const response = await axiosInstance.get(endpoints.chat.getmygroups);
  return response.data.data.groups as GroupList[];
};
