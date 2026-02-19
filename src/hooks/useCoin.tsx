import { useQuery } from "@tanstack/react-query";

interface Roi {
  times: number;
  currency: string;
  percentage: number;
}

export type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h?: number;
  low_24h?: number;
  price_change_24h?: number;
  price_change_percentage_24h?: number;
  market_cap_change_24h?: number;
  market_cap_change_percentage_24h?: number;
  circulating_supply: number;
  total_supply: number;
  max_supply?: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi?: Roi;
  last_updated: string;
};

const getCoins = async (): Promise<Coin[]> => {
  const res = await fetch("/api/coins/markets?vs_currency=usd");

  if (!res.ok) {
    throw new Error("");
  }
  return res.json();
};

export const useCoins = () =>
  useQuery({
    queryKey: ["coins"],
    queryFn: getCoins,
  });
