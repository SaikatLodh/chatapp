import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";

const refreshtoken = async (): Promise<string> => {
  const response = await axiosInstance.post(endpoints.auth.refreshtoken, {});
  return response.data.data.token;
};

const FOURTEEN_MINUTES = 14 * 60 * 1000;

const scheduleTokenRefresh = () => {
  setInterval(async () => {
    try {
      console.log("Attempting to refresh token...");
      await refreshtoken();
    } catch (err) {
      console.error("Token refresh failed:", err);
    }
  }, FOURTEEN_MINUTES);
};

export const initRefreshToken = () => {
  scheduleTokenRefresh();
};
