import { header } from "~/utils/Table";
import { displayTime, displayAsCurrency, displayId } from "~/utils/TextUtil";

export const ITEM_HEADERS = [
  header("ID", "id", "left", displayId),
  header("Waktu", "createdAt", "left", displayTime),
  header("Pembeli", "customer_name"),
  header("Kasir", "cashier_name"),
  header("Pegawai", "employee_name"),
  header("Metode", "transaction_method"),
  header("Nominal", "total", "right", displayAsCurrency),
];

export const ITEM_VALUE = ["name", "price_retail", "price_wholesale", "stock"];
