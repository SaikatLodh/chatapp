import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";
import { AdminDashboardStatus } from "@/type";

export const getdashboardstats = async (): Promise<AdminDashboardStatus> => {
  const response = await axiosInstance.get(endpoints.admin.getdashboardstats);
  return response.data.data.stats as AdminDashboardStatus;
};
