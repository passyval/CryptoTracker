import { useState } from "react";
import { Link } from "react-router-dom";
import { useCoins } from "../../hooks/useCoin";
import { useFavorites } from "../../hooks/useFavorite";

export const Home = ({ renderNews }: { renderNews: React.ReactNode }) => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useCoins();
  const { favorites, toggle } = useFavorites();

  const coins =
    data?.filter((c) =>
      (c.name + c.symbol).toLowerCase().includes(search.toLowerCase()),
    ) || [];

  return (
    <>
      <Input
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
      />

      <div className="market-grid">
        <div className="market-table card">
          <table className="tv-table">
            <thead>
              <tr>
                <th>Fav</th>
                <th>Coin</th>
                <th>Prezzo</th>
                <th>24h</th>
                <th>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5}>Caricamento...</td>
                </tr>
              )}
              {!isLoading &&
                coins.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <button onClick={() => toggle(c.id)}>
                        {favorites.includes(c.id) ? "⭐" : "☆"}
                      </button>
                    </td>
                    <td className="coin-info">
                      <img src={c.image} alt={c.name} />
                      <Link to={`/coin/${c.id}`}>
                        <div>{c.name}</div>
                        <div>{c.symbol.toUpperCase()}</div>
                      </Link>
                    </td>
                    <td>${c.current_price.toLocaleString()}</td>
                    <td
                      className={
                        (c.price_change_percentage_24h ?? 0) > 0
                          ? "green"
                          : "red"
                      }
                    >
                      {c.price_change_percentage_24h?.toFixed(2) ?? "N/A"}%
                    </td>
                    <td>${c.market_cap.toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="chart-panel card">
          <h3 className="panel-title">Grafico rapido</h3>
          <div className="chart-placeholder">Seleziona una coin…</div>
          {renderNews}
        </div>
      </div>
    </>
  );
};

const Input = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="top-row">
    <div className="search-wrap">
      <input
        className="search-input"
        placeholder="Cerca (es. bitcoin, btc)"
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);
