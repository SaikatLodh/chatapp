import { axiosInstance } from "@/api/axiosinstance/axiosinstance";
import endpoints from "@/api/endpoints/endpoints";
import { AxiosProgressEvent } from "axios";
const sendmessage = async ({
  data,
  id,
  onUploadProgress,
}: {
  data: FormData;
  id: string;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}) => {
  const response = await axiosInstance.post(
    `${endpoints.chat.sendmessage}/${id}`,
    data,
    {
      onUploadProgress,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export { sendmessage };
