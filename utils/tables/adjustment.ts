import { header } from "~/utils/Table";

export const ADJUSTMENT_VALUE = [
  "createdAt",
  "description",
  "item_count",
  "total_count",
];

export const ADJUSTMENT_HEADERS = [
  header("Waktu", ADJUSTMENT_VALUE[0]),
  header("Notes", ADJUSTMENT_VALUE[1]),
  header("Items", ADJUSTMENT_VALUE[2]),
  header("Adjustment", ADJUSTMENT_VALUE[3]),
];

export const ADJUSTMENT_DETAIL_VALUE = ["item_name", "qty"];

export const ADJUSTMENT_DETAILS_HEADERS = [
  header("Barang", ADJUSTMENT_DETAIL_VALUE[0]),
  header("Jumlah", ADJUSTMENT_DETAIL_VALUE[1]),
];

export const deleteAdjustment = (instance: any, id: number) => {
  instance.data = instance.data.filter(
    (adjustment: any) => adjustment.id !== id
  );
  instance.dataCounts--;
};
