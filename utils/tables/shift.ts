import { header } from "~/utils/Table";
import { displayTime } from "~/utils/TextUtil";

export const ITEM_HEADERS = [
  header("Nama Pegawai", "cashier_name"),
  header("Mulai", "starting_shift", "left", displayTime),
  header("Selesai", "ending_shift"),
];

export const ITEM_VALUE = ["name", "price_retail", "price_wholesale", "stock"];
