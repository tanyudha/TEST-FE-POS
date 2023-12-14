import { header } from "~/utils/Table";

export const EMPLOYEE_HEADERS = [
  header("Nama Pegawai", "name"),
  header("Posisi", "role"),
  header("Shift", "shift"),
];

export const EMPLOYEE_VALUE = [
  "name",
  "price_retail",
  "price_wholesale",
  "stock",
];

export const EMPLOYEE_ANALYTICS_HEADERS = [
  header("Nama", "name"),
  header("Jabatan", "role"),
  header("Nominal Transaksi", "total"),
  header("Nominal Refund", "refund"),
];
