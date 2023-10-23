import axios from "axios";
import { toast } from "react-toastify";

axios.interceptors.response.use(null, (error) => {
  console.log("Interceptor called da");
  const expectedError =
    error.response &&
    error.response.status >= 404 &&
    error.response.status < 500;
  if (!expectedError) {
    console.log("Logging an unexpected  error", error);
    toast("An unexpected error occured");
  }
  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
