import { useCoins } from "../../hooks/useCoin";
import { Card } from "../../components/Card";

export const Favorite = () => {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const { data, isError, isLoading } = useCoins();

  if (isLoading) {
    return <div>Caricamento...</div>;
  }

  if (isError) {
    return <div>Errore durante il caricamento delle monete</div>;
  }

  if (!data) {
    return null;
  }

  const filteredCoin = data.filter(({ id }) => favorites.includes(id));

  if (!filteredCoin.length) {
    return (
      <Wrapper>
        <p>Nessuna coin nei preferiti.</p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {filteredCoin.map((coin) => (
        <Card
          current_price={coin.current_price}
          id={coin.id}
          image={coin.image}
          market_cap={coin.market_cap}
          name={coin.name}
          price_change_percentage_24h={coin.price_change_percentage_24h}
        />
      ))}
    </Wrapper>
  );
};

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <h2>⭐ Preferiti</h2>
      <div className="grid grid-cols-3 gap-6">{children}</div>
    </div>
  );
};

export default Favorite;
