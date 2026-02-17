import { useQuery } from "@tanstack/react-query";

interface Ticker {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
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
}

interface Roi {
  times: number;
  currency: string;
  percentage: number;
}

const getTickers = async (): Promise<Ticker[] | undefined> => {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1",
    );
    return await res.json();
  } catch (e) {
    console.error("Errore ticker:", e);
  }
};

export const Ticker = () => {
  const { data } = useQuery({
    queryKey: ["tickers"],
    queryFn: getTickers,
    refetchInterval: 30000,
  });

  if (!data) {
    return null;
  }

  return (
    <div className="ticker-bar">
      <div className="ticker-track">
        {data.map((c) => (
          <div key={c.id} className="ticker-item">
            <span className="t-name">{c.symbol.toUpperCase()}</span>
            <span className="t-price">${c.current_price.toLocaleString()}</span>
            <span
              className={
                c.price_change_percentage_24h === null
                  ? ""
                  : c.price_change_percentage_24h > 0
                    ? "t-up"
                    : "t-down"
              }
            >
              {c.price_change_percentage_24h !== null
                ? c.price_change_percentage_24h.toFixed(2) + "%"
                : "N/A"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
