export const createPurchaseOrder = async (instance: any, payload: any) => {
  const url = `purchase-order/`;
  const res = await instance.$axios.post(url, payload);
  return res;
};

export const getAllPurchaseOrder = async (instance: any, query = "") => {
  const url = `purchase-order/${query}`;
  const res = await instance.$axios.get(url);
  return res.data;
};

export const getPurchaseOrderDetail = async (instance: any, id: any) => {
  const url = `purchase-order/${id}`;
  const res = await instance.$axios.get(url);
  return res;
};

export const updatePurchaseOrder = async (instance: any, payload: any) => {
  const url = `purchase-order/`;
  const res = await instance.$axios.put(url, payload);
  return res;
};

export const deletePurchaseOrder = async (instance: any, id: any) => {
  const url = `purchase-order/${id}`;
  const res = await instance.$axios.delete(url);
  return res;
};
