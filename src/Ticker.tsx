import { useEffect, useState } from "react";
import "./App.css";

export default function Ticker() {
  const [coins, setCoins] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1"
        );
        const json = await res.json();
        setCoins(json);
      } catch (e) {
        console.error("Errore ticker:", e);
      }
    }

    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ticker-bar">
      <div className="ticker-track">
        {coins.map((c) => (
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
}
