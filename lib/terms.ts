import { object, Output, parse, picklist, string } from "valibot";
import db from "./db";
import sql from "./terms.sql";

const TermKind = picklist([
  "dealer_name",
  "dealer_seller_id",
  "dealer_phone_number",
]);
export type TermKind = Output<typeof TermKind>;

export const Term = object({
  kind: TermKind,
  term: string(),
});
export type Term = Output<typeof Term>;

export function getTerms() {
  const rows = db.prepare(sql.getAll).all();
  const terms: Term[] = [];

  for (const row of rows) {
    const term = parse(Term, row);

    terms.push(term);
  }

  return terms;
}

export function addTerms(terms: Term[]) {
  const stmt = db.prepare(sql.insert);

  for (const term of terms) {
    stmt.run([term.kind, term.term]);
  }
}

export function removeTerms(terms: Term[]) {
  const stmt = db.prepare(sql.delete);

  for (const term of terms) {
    stmt.run([term.kind, term.term]);
  }
}
