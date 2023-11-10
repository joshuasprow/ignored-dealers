import { object, Output, picklist, string } from "valibot";

const TermKind = picklist([
  "dealer_name",
  "dealer_location",
  "dealer_seller_id",
  "dealer_phone_number",
]);
export type TermKind = Output<typeof TermKind>;

export const Term = object({
  kind: TermKind,
  term: string(),
});
export type Term = Output<typeof Term>;

export type Terms = Map<string, TermKind>;
