import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import "./App.css";
import CoinStats from "./CoinStats";

type PricePoint = { time: string; price: number };


function calculateSMA(data: PricePoint[], period: number) {
  return data.map((_, i) => {
    if (i < period) return { time: data[i].time, value: null };
    const slice = data.slice(i - period, i);
    const avg = slice.reduce((a, b) => a + b.price, 0) / period;
    return { time: data[i].time, value: avg };
  });
}

// EMA
function calculateEMA(data: PricePoint[], period: number) {
  const k = 2 / (period + 1);
  let emaPrev = data[0].price;

  return data.map((p, i) => {
    if (i === 0) return { time: p.time, value: p.price };
    const ema = p.price * k + emaPrev * (1 - k);
    emaPrev = ema;
    return { time: p.time, value: ema };
  });
}

// RSI
function calculateRSI(data: PricePoint[], period = 14) {
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = data[i].price - data[i - 1].price;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  const rsiData = data.map((p, i) => {
    if (i < period) return { time: p.time, value: null };

    const diff = data[i].price - data[i - 1].price;
    if (diff >= 0) {
      avgGain = (avgGain * (period - 1) + diff) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) - diff) / period;
    }

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    return { time: p.time, value: rsi };
  });

  return rsiData;
}

// MACD
function calculateMACD(data: PricePoint[]) {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);

  const macdLine = data.map((_, i) => ({
    time: data[i].time,
    value: ema12[i].value - ema26[i].value,
  }));

  const signalLine = calculateEMA(
    macdLine.map((m) => ({ time: m.time, price: m.value })),
    9
  );

  const histogram = macdLine.map((m, i) => ({
    time: m.time,
    value: m.value - signalLine[i].value,
  }));

  return { macdLine, signalLine, histogram };
}

// ----------------------
// COMPONENTE PRINCIPALE
// ----------------------
  
export default function CoinChart() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PricePoint[]>([]);
  const [coin, setCoin] = useState<any>(null);
  const [days, setDays] = useState<number>(7);
  const [loading, setLoading] = useState(true);

  // Indicatori ON/OFF
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [showMACD, setShowMACD] = useState(true);

  const [sma, setSMA] = useState<any[]>([]);
  const [ema, setEMA] = useState<any[]>([]);
  const [rsi, setRSI] = useState<any[]>([]);
  const [macd, setMACD] = useState<any>({
    macdLine: [],
    signalLine: [],
    histogram: [],
  });

  useEffect(() => {
    if (!id) return;

    async function loadChart() {
      setLoading(true);

      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
        );
        const json = await res.json();

        const formatted = json.prices.map((p: any) => ({
          time: new Date(p[0]).toLocaleString("it-IT", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
          }),
          price: p[1],
        }));

        setData(formatted);

        // Calcolo indicatori
        setSMA(calculateSMA(formatted, 20));
        setEMA(calculateEMA(formatted, 20));
        setRSI(calculateRSI(formatted, 14));
        setMACD(calculateMACD(formatted));
      } catch (error) {
        console.error("Errore grafico:", error);
      } finally {
        setLoading(false);
      }
    }

    async function loadCoin() {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}`
        );
        const json = await res.json();
        setCoin(json);
      } catch (error) {
        console.error("Errore coin:", error);
      }
    }

    loadCoin();
    loadChart();
  }, [id, days]);

  return (
    <div className="container">
      <div className="chart-page">

        {/* HEADER */}
        <div className="chart-header card">
          <Link to="/" className="back">← Torna indietro</Link>

          <div className="chart-title">
            <h2>{coin ? coin.name : "Caricamento..."}</h2>

            <div className="chart-sub">
              {coin && (
                <span className="mono">
                  ${coin.market_data?.current_price?.usd?.toLocaleString()}
                </span>
              )}

              <div className="timeframe">
                <button className={days === 1 ? "active" : ""} onClick={() => setDays(1)}>1D</button>
                <button className={days === 7 ? "active" : ""} onClick={() => setDays(7)}>7D</button>
                <button className={days === 30 ? "active" : ""} onClick={() => setDays(30)}>1M</button>
                <button className={days === 365 ? "active" : ""} onClick={() => setDays(365)}>1Y</button>
              </div>
            </div>
          </div>
        </div>

        {/* TOGGLE INDICATORI */}
        <div className="indicator-toggle card">
          <button onClick={() => setShowSMA(!showSMA)}>SMA</button>
          <button onClick={() => setShowEMA(!showEMA)}>EMA</button>
          <button onClick={() => setShowRSI(!showRSI)}>RSI</button>
          <button onClick={() => setShowMACD(!showMACD)}>MACD</button>
        </div>
        {/* STATISTICHE COIN */}
          <CoinStats coin={coin} />


        {/* GRAFICO PRINCIPALE */}
        <div className="chart-card card">
          {loading ? (
            <div className="loading">Caricamento grafico...</div>
          ) : (
            <ResponsiveContainer width="100%" height={420}>
              <LineChart data={data}>
                <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: "var(--muted)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ background: "var(--panel)", border: "1px solid var(--glass-border)" }} />

                <Line type="monotone" dataKey="price" stroke="#2aa7ff" strokeWidth={2.5} dot={false} />

                {showSMA && (
                  <Line
                    type="monotone"
                    data={sma}
                    dataKey="value"
                    stroke="#ffcc00"
                    strokeWidth={1.5}
                    dot={false}
                  />
                )}
                {showEMA && (
                  <Line
                    type="monotone"
                    data={ema}
                    dataKey="value"
                    stroke="#ff00aa"
                    strokeWidth={1.5}
                    dot={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* RSI */}
        {showRSI && (
          <div className="chart-card card">
            <h4>RSI</h4>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={rsi}>
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 100]} tick={{ fill: "var(--muted)" }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#ffaa00"
                  fill="rgba(255,170,0,0.2)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* MACD */}
        {showMACD && (
          <div className="chart-card card">
            <h4>MACD</h4>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart>
                <XAxis dataKey="time" hide />
                <YAxis tick={{ fill: "var(--muted)" }} />
                <Tooltip />

                <Line
                  type="monotone"
                  data={macd.macdLine}
                  dataKey="value"
                  stroke="#00ffaa"
                  dot={false}
                />
                <Line
                  type="monotone"
                  data={macd.signalLine}
                  dataKey="value"
                  stroke="#ff00aa"
                  dot={false}
                />
                <Line
                  type="monotone"
                  data={macd.histogram}
                  dataKey="value"
                  stroke="#8884d8"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* STATISTICHE COIN */}
      </div>
    </div>
  );
}
