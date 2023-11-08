import { object, parse, string, type Output } from "valibot";
import db from "./db";

const Dealer = object({
  seller_id: string(),
  name: string(),
  location: string(),
  phone_number: string(),
  search_string: string(),
});
export type Dealer = Output<typeof Dealer>;

export function getDealers() {
  const rows = db
    .prepare(
      `
select seller_id,
       "name",
       "location",
       phone_number,
       lower(seller_id || "name" || "location" || phone_number) as search_string
from dealers 
where seller_id is not null
  and "name" is not null
  and "location" is not null
  and phone_number is not null;`,
    )
    .all();

  const dealers: Dealer[] = [];

  for (const row of rows) {
    const dealer = parse(Dealer, row);

    dealers.push(dealer);
  }

  return dealers;
}
