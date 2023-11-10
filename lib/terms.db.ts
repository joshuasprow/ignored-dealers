import { parse } from "valibot";
import db from "./db";
import { Term } from "./terms";

export const sql = {
  create: `
create table ignored_terms
(
    kind    text,
    term text,
    unique (kind, term)
);`,
  getAll: `
select kind,
       term
from ignored_terms;`,
  insert: `
insert into ignored_terms (kind, term)
values (?, ?)
on conflict do nothing;`,
  delete: `
delete from ignored_terms 
where kind = ?
  and term = ?;`,
  init: `
insert into ignored_terms (kind, term)
values ('dealer_seller_id', '1023'),
       ('dealer_name', 'All Import Auto Parts');`,
} as const;

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
