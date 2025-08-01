import axios from "axios";

const googleSignupAuth = async (code: string) => {
  const response = await axios.get(
    `http://localhost:8000/api/v1/auth/googlesignup?code=${code}`
  );
  return response.data;
};

const googleLoginAuth = async (code: string) => {
  const response = await axios.get(
    `http://localhost:8000/api/v1/auth/googlesignin?code=${code}`
  );
  return response.data;
};

export { googleSignupAuth, googleLoginAuth };
