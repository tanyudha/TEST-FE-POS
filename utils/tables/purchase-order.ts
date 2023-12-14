import { header } from "~/utils/Table";

export const PO_VALUE = ["createdAt", "supplier", "id"];

export const PO_HEADERS = [
  header("Waktu", PO_VALUE[0]),
  header("Supplier", PO_VALUE[1]),
  header("ID", PO_VALUE[2]),
];

export const PO_DETAIL_VALUE = ["item_name", "qty"];

export const PO_DETAILS_HEADERS = [
  header("Barang", PO_DETAIL_VALUE[0]),
  header("Jumlah", PO_DETAIL_VALUE[1]),
];

export const updatePO = (instance: any, cur: any) => {
  const idx = instance.data.find((i: any) => i.id === cur.id);
  idx.createdAt = cur.createdAt;
  idx.supplier = cur.supplier;
};

export const deletePO = (instance: any, id: number) => {
  instance.data = instance.data.filter((po: any) => po.id !== id);
  instance.dataCounts--;
};
