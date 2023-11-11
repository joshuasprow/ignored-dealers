import { Database } from "better-sqlite3";
import { parse } from "valibot";
import { Dealer } from "./dealers";
import dealersJson from "./dealers.json";

const sql = {
  create: `
create table dealers (
    seller_id    text,
    "name"       text,
    "location"   text,
    phone_number text
);`,
  getAll: `
select seller_id,
       "name",
       "location",
       phone_number,
       seller_id || ' ' || "name" || ' ' || "location" || ' ' || phone_number as "query"
from dealers
where seller_id is not null
  and "name" is not null
  and "location" is not null
  and phone_number is not null
order by "name";`,
  init: `
insert into dealers (seller_id, "name", "location", phone_number)
values ${dealersJson
    .map(
      (d) =>
        `('${escape(d.seller_id)}', ` +
        `'${escape(d.name)}', ` +
        `'${escape(d.location)}', ` +
        `'${escape(d.phone_number)}')`
    )
    .join(",\n")}`,
} as const;

function escape(str: string) {
  return str.replace(/'/g, "''");
}

export function init(db: Database) {
  db.prepare(sql.create).run();
  db.prepare(sql.init).run();
}

export function getDealers(db: Database) {
  const rows = db.prepare(sql.getAll).all();
  const dealers: Dealer[] = [];

  for (const row of rows) {
    const dealer = parse(Dealer, row);

    dealers.push(dealer);
  }

  return dealers;
}
