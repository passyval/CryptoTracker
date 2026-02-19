import { useQuery } from "@tanstack/react-query";

export type Crypto = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap: number;
};

export const useCoins = () =>
  useQuery<Crypto[]>({
    queryKey: ["coins"],
    queryFn: () =>
      fetch("/api/coins/markets?vs_currency=usd").then((r) => r.json()),
  });
