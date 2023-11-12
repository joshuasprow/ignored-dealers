import usePrices from "./use-prices";

export default function useDealerPrices(dealer_query: string) {
  const prices = usePrices();

  return prices.get(dealer_query) ?? [];
}
