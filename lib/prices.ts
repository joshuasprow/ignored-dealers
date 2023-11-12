import { nullable, number, object, string, type Output } from "valibot";

export const Price = object({
  part_code: string(),
  ic: string(),
  grade: string(),
  make_name: string(),
  model_name: string(),
  year: string(),
  stock_number: nullable(string()),
  distance: number(),
  dealer_name: string(),
  dealer_seller_id: string(),
  dealer_location: string(),
  dealer_phone_number: string(),
  dealer_query: string(),
});
export type Price = Output<typeof Price>;

export type Prices = Map<string, Price[]>;
