import { Database } from "better-sqlite3";
import { parse, ValiError } from "valibot";
import { Price } from "./prices";
import pricesJson from "./prices.json";
import { renderQueryValues } from "./db";

const sql = {
  drop: `drop table if exists prices;`,
  create: `
create table prices (
    searched_at integer not null,
    part_code text not null,
    ic text not null,
    grade text not null,
    price float,
    stock_number text,
    car_part_part text,
    car_part_model text not null,
    car_part_year text,
    distance integer,
    dealer_name text not null,
    dealer_seller_id text not null,
    dealer_location text not null,
    dealer_phone_number text not null
);`,
  getAll: `
select searched_at,
       part_code,
       ic,
       grade,
       stock_number,
       distance,
       price,
       car_part_part,
       car_part_model,
       car_part_year,
       dealer_name,
       dealer_seller_id,
       dealer_location,
       dealer_phone_number,
       dealer_seller_id || ' ' || dealer_name || ' ' || dealer_location || ' ' || dealer_phone_number as dealer_query
from prices;`,
  init: `
insert into prices (searched_at,
                    part_code,
                    ic,
                    grade,
                    stock_number,
                    distance,
                    price,
                    car_part_part,
                    car_part_model,
                    car_part_year,
                    dealer_name,
                    dealer_seller_id,
                    dealer_location,
                    dealer_phone_number)
values (:searched_at,
        :part_code,
        :ic,
        :grade,
        :stock_number,
        :distance,
        :price,
        :car_part_part,
        :car_part_model,
        :car_part_year,
        :dealer_name,
        :dealer_seller_id,
        :dealer_location,
        :dealer_phone_number)`,
} as const;

export function init(db: Database) {
  db.prepare(sql.drop).run();
  db.prepare(sql.create).run();

  const stmt = db.prepare(sql.init);

  for (const price of pricesJson) {
    stmt.run(price);
  }
}

export function getPrices(db: Database) {
  const rows = db.prepare(sql.getAll).all();
  const prices: Price[] = [];

  for (const row of rows) {
    const price = parse(Price, row);

    prices.push(price);
  }

  return prices;
}
