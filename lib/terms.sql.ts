const sql = {
  create: `
create table ignored_terms
(
    kind    text,
    "value" text,
    unique (kind, "value")
);`,
  getAll: `
select kind,
       "value"
from ignored_terms;`,
  init: `
insert into ignored_terms (kind, "value")
values ('dealer_seller_id', '1023'),
       ('dealer_name', 'All Import Auto Parts');`,
} as const;

export default sql;
