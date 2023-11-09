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
values ('dealer-name', 'Don'''s');`,
} as const;

export default sql;
