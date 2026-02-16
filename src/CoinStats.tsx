import "./App.css";

export default function CoinStats({ coin }: { coin: any }) {
  if (!coin) return null;

  const m = coin.market_data;

  return (
    <div className="stats card">
      <h3 className="panel-title">📊 Statistiche</h3>

      <div className="stats-grid">

        <div className="stat-box">
          <div className="stat-label">Market Cap</div>
          <div className="stat-value">${m.market_cap.usd.toLocaleString()}</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Volume 24h</div>
          <div className="stat-value">${m.total_volume.usd.toLocaleString()}</div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Dominance</div>
          <div className="stat-value">
            {m.market_cap_change_percentage_24h?.toFixed(2)}%
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Circulating Supply</div>
          <div className="stat-value">
            {m.circulating_supply?.toLocaleString()}
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-label">Max Supply</div>
          <div className="stat-value">
            {m.max_supply ? m.max_supply.toLocaleString() : "N/A"}
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-label">All Time High</div>
          <div className="stat-value">
            ${m.ath.usd.toLocaleString()}
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-label">All Time Low</div>
          <div className="stat-value">
            ${m.atl.usd.toLocaleString()}
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-label">ROI</div>
          <div className="stat-value">
            {coin.market_data.roi
              ? (coin.market_data.roi.percentage).toFixed(2) + "%"
              : "N/A"}
          </div>
        </div>

      </div>
    </div>
  );
}
