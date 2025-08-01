import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";

export const changepassword = async (data: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await axiosInstance.patch(
    endpoints.user.changepassword,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
