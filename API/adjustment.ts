export const createAdjustment = async (instance: any, payload: any) => {
  payload.item_count = payload.items.length;
  payload.total_count = payload.items.reduce(
    (a: any, b: any) => a + (parseInt(b.qty) || 0),
    0
  );
  payload.item_names = payload.items.map((row: any) => row.item_name).join(",");
  const url = `adjustment/`;
  const res = await instance.$axios.post(url, payload);
  return res;
};

export const getAllAdjustment = async (instance: any, query = "") => {
  const url = `adjustment/${query}`;
  const res = await instance.$axios.get(url);
  return res.data;
};

export const getAdjustmentDetail = async (instance: any, id: any) => {
  const url = `adjustment/${id}`;
  const res = await instance.$axios.get(url);
  return res;
};

export const deleteAdjustment = async (instance: any, id: any) => {
  const url = `adjustment/${id}`;
  const res = await instance.$axios.delete(url);
  return res;
};
