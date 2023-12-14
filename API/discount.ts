export const createDiscount = async (instance: any, discount: any) => {
  const url = "discount/create-discount";
  const res = await instance.$axios.post(url, discount);
  return res;
};

export const getAllDiscounts = async (instance: any, query = "") => {
  const url = `discount/${query}`;
  const res = await instance.$axios.get(url);
  return res.data;
};

export const getDiscountDetail = async (instance: any, id: any) => {
  const url = `discount/${id}`;
  const res = await instance.$axios.get(url);
  const { data } = res;
  const discount = {
    id: data.id,
    name: data.name,
    isPercentage: data.is_percentage,
    percentage: data.percentage,
    amount: data.amount,
    isActive: data.is_active,
  };
  return discount;
};
export const updateDiscount = async (instance: any, payload: any) => {
  const url = "discount/update-discount";
  await instance.$axios.put(url, payload);
};

export const deleteDiscount = async (instance: any, id: any) => {
  const url = `discount/delete-discount/${id}`;
  await instance.$axios.delete(url);
};
