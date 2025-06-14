import axios from "axios";

export const fetchCurrentTime = (api) => {
  return axios.get(api).then((res) => res.data);
};
