import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";

export const updateuser = async (data: FormData) => {
  const response = await axiosInstance.patch(
    `${endpoints.user.updateuser}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
