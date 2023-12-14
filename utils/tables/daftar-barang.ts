import { header } from "~/utils/Table";
import { displayAsCurrency } from "~/utils/TextUtil";

export const ITEM_HEADERS = [
  header("Nama", "name"),
  header("H. Ecer", "price_retail", "right", displayAsCurrency),
  header("H. Grosir", "price_wholesale", "right", displayAsCurrency),
  header("Stock", "stock", "right"),
];

export const ITEM_VALUE = ["name", "price_retail", "price_wholesale", "stock"];
