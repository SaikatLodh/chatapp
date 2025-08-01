import { SearchUser } from "@/type";
import { axiosInstance } from "../../axiosinstance/axiosinstance";
import endpoints from "../../endpoints/endpoints";

const searchUser = async (searchTerm: string): Promise<SearchUser[]> => {
  const response = await axiosInstance.get(
    `${endpoints.user.searchuser}?name=${searchTerm}`
  );
  return response.data.data.users as SearchUser[];
};

export default searchUser;
