import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";

export const renamegroup = async ({
  name,
  id,
}: {
  name: string;
  id: string;
}) => {
  const response = await axiosInstance.patch(
    `${endpoints.chat.renamegroup}/${id}`,
    {
      name,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
