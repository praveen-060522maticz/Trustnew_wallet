import axios from "axios";
import { ApiConstants } from "./ApiConstants";


let ApiClient = axios.create({
  baseURL: ApiConstants.BASE_URL,
  timeout: 10000,
});
ApiClient.interceptors.request.use(
  async (configure) => {

      configure.headers.Authorization = "Bearer " + "";
    return configure;
  },
  (error) => {
    console.log("ApiClienterror",error);
    return Promise.reject(error);
  }
);

export default ApiClient;