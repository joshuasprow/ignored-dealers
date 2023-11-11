import { object, string, type Output } from "valibot";

export const Dealer = object({
  seller_id: string(),
  name: string(),
  location: string(),
  phone_number: string(),
  query: string(),
});
export type Dealer = Output<typeof Dealer>;
