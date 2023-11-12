import Database from "better-sqlite3";
// import { init as dealers } from "./dealers.db";
// import { init as prices } from "./prices.db";
// import { init as terms } from "./terms.db";

const db = new Database("tmp/sqlite.db");

// dealers(db);
// prices(db);
// terms(db);

function escapeString(str: string) {
  return str.replace(/'/g, "''");
}

function stringify(value: unknown): string {
  switch (typeof value) {
    case "string":
      return `'${escapeString(value)}'`;
    case "number":
      return `${value}`;
    default:
      if (value === null) {
        return "null";
      }
      throw new Error(`unsupported type ${typeof value}: ${value}`);
  }
}

export function renderQueryValues(json: Record<string, unknown>[]) {
  return json
    .map(
      (d) =>
        `(${Object.values(d)
          .map((v) => stringify(v))
          .join(", ")})`
    )

    .join(",\n");
}

export default db;
