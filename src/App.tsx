import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import CoinChart from "./CoinChart";
import Ticker from "./Ticker";
import CryptoNews from "./CryptoNews";

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap: number;
}

export default function App() {
  const [coins, setCoins] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [time, setTime] = useState<string>(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
        );

        if (!res.ok) throw new Error("Errore HTTP");

        const data = await res.json();
        setCoins(data);
      } catch (error) {
        console.error("Errore nel fetch:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <header className="tv-header">
        <div className="tv-left">
          <nav className="nav">
            <CryptoNews />

            <button className="nav-btn active">Mercato</button>
            <button className="nav-btn">Preferiti</button>
            <button className="nav-btn">Portafoglio</button>
          </nav>
        </div>

        <div className="tv-right">
          <div className="clock">{time}</div>
        </div>
      </header>

      <div className="container">
        <Ticker/>
        
        
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="top-row">
                  <div className="search-wrap">
                    <input
                      className="search-input"
                      placeholder="Cerca (es. bitcoin, btc)"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="market-grid">
                  <div className="market-table card">
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
                        {loading ? (
                          <tr><td colSpan={4} className="loading">Caricamento...</td></tr>
                        ) : (
                          filteredCoins.map((coin) => {
                            const change = coin.price_change_percentage_24h;
                            return (
                              <tr key={coin.id} className="tv-row">
                                <td className="coin-info">
                                  <img src={coin.image} alt={coin.name} />
                                  <Link to={`/coin/${coin.id}`} className="coin-link">
                                    <div className="coin-name">{coin.name}</div>
                                    <div className="coin-symbol">{coin.symbol.toUpperCase()}</div>
                                  </Link>
                                </td>
                                <td className="mono">${coin.current_price.toLocaleString()}</td>
                                <td className={change && change > 0 ? "green mono" : "red mono"}>
                                  {change !== null ? `${change.toFixed(2)}%` : "N/A"}
                                </td>
                                <td className="mono">${coin.market_cap.toLocaleString()}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="chart-panel card">
                    <h3 className="panel-title">Grafico rapido</h3>
                    <div className="chart-placeholder">
                      
                      Seleziona una coin dalla tabella per vedere il grafico dettagliato.
                    </div>
                                        <CryptoNews />

                  </div>
                </div>

              </>
            }
          />

          <Route path="/coin/:id" element={<CoinChart />} />
        </Routes>
      </div>
    </>
  );
}
