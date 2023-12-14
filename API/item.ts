export const createItem = async (instance: any, payload: any) => {
  const url = "item/create-item";
  const res = await instance.$axios.post(url, payload);
  return res;
};

export const getAllItems = async (instance: any, query = "") => {
  try {
    const url = `item/get-all-items${query}`;
    const res = await instance.$axios.$get(url);
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

export const getItemDetail = async (instance: any, id: any) => {
  try {
    const url = `item/get-item/${id}`;
    const res = await instance.$axios.$get(url);
    const item = {
      id: res.id,
      name: res.name,
      retailPrice: res.price_retail,
      wholesalePrice: res.price_wholesale,
      stock: res.stock,
    };
    return item;
  } catch (err) {
    throw new Error(err);
  }
};

export const updateItem = async (instance: any, payload: any) => {
  const url = "item/update-item";
  await instance.$axios.put(url, payload);
};

export const deleteItem = async (instance: any, id: any) => {
  const url = `item/delete/${id}`;
  await instance.$axios.delete(url);
};
