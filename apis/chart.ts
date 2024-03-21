import api from "./config";

export const getChart = async () => {
  const res = await api.get<any, any>("/charthome");
  return res
}