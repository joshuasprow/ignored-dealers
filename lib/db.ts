import Database from "better-sqlite3";
// import { init as dealers } from "./dealers.db";
// import { init as terms } from "./terms.db";

const db = new Database("tmp/sqlite.db");

// dealers(db);
// terms(db);

export default db;
