import { displayAsCurrency } from "../TextUtil";
import { header } from "~/utils/Table";

export const DISCOUNT_VALUE = ["name", "is_active", "nilai"];

export const DISCOUNT_HEADERS = [
  header("Diskon", DISCOUNT_VALUE[0]),
  header("Status", DISCOUNT_VALUE[1]),
  header("Nilai", DISCOUNT_VALUE[2], "right"),
];

export const parseDiscounts = (data: any) => {
  return data.map((row: any) => {
    row.nilai = row.is_percentage
      ? `${row.percentage}%`
      : displayAsCurrency(row.amount);
    row.is_active = row.is_active ? "Aktif" : "Non Aktif";
    return row;
  });
};

export const updateDiscount = (instance: any, cur: any) => {
  const idx = instance.data.find((i: any) => i.id === cur.id);
  idx.name = cur.name;
  idx.is_percentage = cur.is_percentage;
  idx.amount = cur.amount;
  idx.percentage = cur.percentage;
  idx.is_active = cur.is_active;
};

export const deleteDiscount = (instance: any, id: number) => {
  instance.data = instance.data.filter((discount: any) => discount.id !== id);
  instance.dataCounts--;
};
