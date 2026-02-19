import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

interface Roi {
  times: number;
  currency: string;
  percentage: number;
}

interface Coin {
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
}

const getCoins = async (): Promise<Coin[]> => {
  const res = await fetch("/api/coins/markets?vs_currency=usd");
  return res.json();
};

export const Favorite = () => {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  const { data, isLoading } = useQuery({
    queryKey: ["coins"],
    queryFn: getCoins,
  });

  if (isLoading) {
    return <div>Caricamento...</div>;
  }

  if (!data) {
    return null;
  }

  const filteredCoin = data.filter(({ id }) => favorites.includes(id));

  return (
    <div className="market-table card favorites-container">
      <h2>⭐ Preferiti</h2>
      {!filteredCoin.length && <p>Nessuna coin nei preferiti.</p>}
      <table className="tv-table">
        <thead>
          <tr>
            <th>Coin</th>
            <th>Prezzo</th>
            <th>24h</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {filteredCoin.map((coin) => (
            <tr key={coin.id}>
              <td>
                <img src={coin.image} alt={coin.name} />
                <Link to={`/coin/${coin.id}`}>{coin.name}</Link>
              </td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td>{coin.price_change_percentage_24h?.toFixed(2)}%</td>
              <td>${coin.market_cap.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Favorite;
