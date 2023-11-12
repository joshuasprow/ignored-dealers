import { Database } from "better-sqlite3";
import { parse } from "valibot";
import { Price } from "./prices";
import pricesJson from "./prices.json";
import { renderQueryValues } from "./db";

const sql = {
  create: `
create table prices (
    part_code text not null,
    ic text not null,
    grade text not null,
    make_name text not null,
    model_name text not null,
    year text not null,
    stock_number text,
    distance integer not null,
    dealer_name text not null,
    dealer_seller_id text not null,
    dealer_location text not null,
    dealer_phone_number text not null
);`,
  getAll: `
select part_code,
       ic,
       grade,
       make_name,
       model_name,
       year,
       stock_number,
       distance,
       dealer_name,
       dealer_seller_id,
       dealer_location,
       dealer_phone_number,
       dealer_seller_id || ' ' || dealer_name || ' ' || dealer_location || ' ' || dealer_phone_number as dealer_query
from prices;`,
  init: `
insert into prices (part_code, 
                    ic,
                    grade,
                    make_name,
                    model_name,
                    year,
                    stock_number,
                    distance,
                    dealer_name,
                    dealer_seller_id,
                    dealer_location,
                    dealer_phone_number)
values ${renderQueryValues(pricesJson)}`,
} as const;

export function init(db: Database) {
  db.prepare(sql.create).run();
  db.prepare(sql.init).run();
}

export function getPrices(db: Database) {
  const rows = db.prepare(sql.getAll).all();
  const prices: Price[] = [];

  for (const row of rows) {
    const dealer = parse(Price, row);

    prices.push(dealer);
  }

  return prices;
}
