import { loadAxios } from "~/utils/AuthUtil";

export const getAllTransactions = async (instance: any, query: string = "") => {
  loadAxios(instance);
  const res = await instance.$axios.$get(`/transaction?${query}`);
  return res;
};
