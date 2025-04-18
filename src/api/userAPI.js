import axios from "axios";
import { API_URL } from "./config";

export const registerUser = async (data) => {
  return axios.post(`${API_URL}/api/register`, data);
};
