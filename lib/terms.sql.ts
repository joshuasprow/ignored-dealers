const sql = {
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

export default sql;
