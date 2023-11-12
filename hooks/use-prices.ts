import { useQuery } from "@tanstack/react-query";
import type { Price, Prices } from "../lib/prices";

const ENDPOINT = "api/prices";
const QUERY_KEY = "prices";

async function getPrices() {
  const res = await fetch(ENDPOINT);
  const json = await res.json();

  const prices: Prices = new Map();

  for (const price of json as Price[]) {
    const dealerPrices = prices.get(price.dealer_query) ?? [];

    dealerPrices.push(price);

    prices.set(price.dealer_query, dealerPrices);
  }

  return prices;
}

export default function usePrices() {
  const get = useQuery<Prices>({
    initialData: new Map(),
    queryFn: getPrices,
    queryKey: [QUERY_KEY],
  });

  return get.data;
}
