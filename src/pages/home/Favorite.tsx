import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const getCoins = async () => {
  const res = await fetch("/api/coins/markets?vs_currency=usd");
  return res.json();
};

const Favorite = () => {
  // Leggo i preferiti salvati nella Home
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  const { data, isLoading } = useQuery({
    queryKey: ["coins"],
    queryFn: getCoins,
  });

  if (isLoading) return <div>Caricamento...</div>;
  if (!data) return null;

  // Filtro solo le coin preferite
  const filtered = data.filter((coin: any) => favorites.includes(coin.id));

  return (
   <div className="market-table card favorites-container">
      <h2>⭐ Preferiti</h2>

      {filtered.length === 0 && (
        <p>Nessuna coin nei preferiti.</p>
      )}

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
          {filtered.map((coin: any) => (
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
