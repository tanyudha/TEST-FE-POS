import { loadAxios } from "~/utils/AuthUtil";

export const createUser = async (instance: any, payload: any) => {
  const res = await instance.$axios.$post("/user/", payload);
  return res;
};

export const getAllCashier = async (instance: any) => {
  loadAxios(instance);
  const res = await instance.$axios.$get("user/cashier");
  return res;
};

export const getAllUser = async (instance: any, query: string = "") => {
  const res = await instance.$axios.$get(
    `/user/?include_admin=1&include_po=1&${query}`
  );
  return res;
};

export const getUserDetail = async (instance: any, id: any) => {
  const res = await instance.$axios.$get(`/user/${id}`);
  return res;
};

export const updateUser = async (instance: any, payload: any) => {
  const res = await instance.$axios.$put("/user/", payload);
  return res;
};

export const deleteUser = async (instance: any, id: number) => {
  const res = await instance.$axios.$delete(`/user/${id}`);
  return res;
};

export const getEmployeeAnalytics = async (instance: any, dates: string[]) => {
  const res = await instance.$axios.get(
    `/analytics/by-user?startDate=${dates[0]}&endDate=${dates[1]}`
  );
  return res;
};
