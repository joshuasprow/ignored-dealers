import { object, parse, string, type Output } from "valibot";
import db from "./db";
import sql from "./dealers.sql";

const Dealer = object({
  seller_id: string(),
  name: string(),
  location: string(),
  phone_number: string(),
  query: string(),
});
export type Dealer = Output<typeof Dealer>;

export function getDealers() {
  const rows = db.prepare(sql.getAll).all();
  const dealers: Dealer[] = [];

  for (const row of rows) {
    const dealer = parse(Dealer, row);
    dealers.push(dealer);
  }

  return dealers;
}
