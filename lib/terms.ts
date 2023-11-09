import { object, Output, picklist, string } from "valibot";

const TermKind = picklist([
  "dealer_name",
  "dealer_seller_id",
  "dealer_phone_number",
]);
export type TermKind = Output<typeof TermKind>;

const Term = object({
  kind: TermKind,
  value: string(),
});

export async function getTerms() {
    
}