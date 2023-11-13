import { nullable, number, object, string, type Output } from "valibot";

export const Price = object({
  searched_at: number(),
  part_code: string(),
  ic: string(),
  grade: string(),
  price: nullable(number()),
  stock_number: nullable(string()),
  car_part_part: nullable(string()),
  car_part_model: string(),
  car_part_year: nullable(string()),
  distance: nullable(number()),
  dealer_name: string(),
  dealer_seller_id: string(),
  dealer_location: string(),
  dealer_phone_number: string(),
  dealer_query: string(),
});
export type Price = Output<typeof Price>;

export type Prices = Map<string, Price[]>;
