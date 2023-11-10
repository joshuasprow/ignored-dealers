import Database from "better-sqlite3";
import dealersSql from "./dealers.sql";
import { sql as termsSql } from "./terms.db";

const db = new Database(":memory:");

try {
  db.prepare(dealersSql.create).run();
  db.prepare(dealersSql.init).run();
  db.prepare(termsSql.create).run();
  db.prepare(termsSql.init).run();
} catch (error) {
  console.error(error);
}

export default db;
