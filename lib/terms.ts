import { object, Output, parse, picklist, string } from "valibot";
import db from "./db";
import sql from "./terms.sql";

const TermKind = picklist([
  "dealer_name",
  "dealer_seller_id",
  "dealer_phone_number",
]);
export type TermKind = Output<typeof TermKind>;

const Term = object({
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

export function addTerm(term: Term) {
  db.prepare(sql.insert).bind([term.kind, term.term]).run();
}

export function removeTerm(term: Term) {
  db.prepare(sql.delete).bind([term.kind, term.term]).run();
}
