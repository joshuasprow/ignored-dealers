import Database from "better-sqlite3";
import dealersSql from "./dealers.sql";

const db = new Database(":memory:");

try {
  db.prepare(dealersSql.create).run();
  db.prepare(dealersSql.insert).run();
} catch (error) {
  console.error(error);
}

export default db;
