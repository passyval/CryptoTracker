import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Crypto = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap: number;
};

interface HomeProps {
  renderNews: React.ReactNode;
}

const getCoins = async (): Promise<Crypto[] | undefined> => {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd",
    );
    return await res.json();
  } catch (e) {
    console.error("Errore ticker:", e);
  }
};

export const Home = ({ renderNews }: HomeProps) => {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["coins"],
    queryFn: getCoins,
  });

  const filteredCoins = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  if (isLoading) {
    return (
      <Wrapper
        renderInput={
          <Input value={search} onChange={(e) => setSearch(e.target.value)} />
        }
        renderNews={renderNews}
      >
        <tr>
          <td colSpan={4} className="loading">
            Caricamento...
          </td>
        </tr>
      </Wrapper>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Wrapper
      renderInput={
        <Input value={search} onChange={(e) => setSearch(e.target.value)} />
      }
      renderNews={renderNews}
    >
      {filteredCoins.map(
        ({
          symbol,
          id,
          current_price,
          price_change_percentage_24h,
          image,
          market_cap,
          name,
        }) => (
          <tr key={id} className="tv-row">
            <td className="coin-info">
              <img src={image} alt={name} />
              <Link to={`/coin/${id}`} className="coin-link">
                <div className="coin-name">{name}</div>
                <div className="coin-symbol">{symbol.toUpperCase()}</div>
              </Link>
            </td>
            <td className="mono">${current_price.toLocaleString()}</td>
            <td
              className={
                price_change_percentage_24h && price_change_percentage_24h > 0
                  ? "green mono"
                  : "red mono"
              }
            >
              {price_change_percentage_24h !== null
                ? `${price_change_percentage_24h.toFixed(2)}%`
                : "N/A"}
            </td>
            <td className="mono">${market_cap.toLocaleString()}</td>
          </tr>
        ),
      )}
    </Wrapper>
  );
};

interface WrapperProps extends HomeProps {
  children: React.ReactNode;
  renderInput: React.ReactNode;
}

const Wrapper = ({ children, renderInput, renderNews }: WrapperProps) => {
  return (
    <>
      {renderInput}
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
            <tbody>{children}</tbody>
          </table>
        </div>
        <div className="chart-panel card">
          <h3 className="panel-title">Grafico rapido</h3>
          <div className="chart-placeholder">
            Seleziona una coin dalla tabella per vedere il grafico dettagliato.
          </div>
          {renderNews}
        </div>
      </div>
    </>
  );
};

interface InputProps extends Pick<
  React.HTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value: string;
}

const Input = ({ onChange, value }: InputProps) => {
  return (
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
};
