import { Link } from "react-router-dom";
import type { Coin } from "../../hooks/useCoin";
import { clsx } from "clsx";

type CardProps = Pick<
  Coin,
  | "id"
  | "name"
  | "current_price"
  | "price_change_percentage_24h"
  | "market_cap"
  | "image"
>;

export const Card = ({
  current_price,
  id,
  image,
  market_cap,
  name,
  price_change_percentage_24h,
}: CardProps) => {
  console.log({ price_change_percentage_24h });

  return (
    <div className="flex gap-2 bg-blue-700/15 p-4 backdrop-blur-2xl rounded-lg">
      <figure className="w-20">
        <img src={image} alt={name} />
      </figure>
      <div className="flex-1">
        <header className="flex justify-between">
          <h3 className="text-3xl font-bold"> {name}</h3>
          <div className="flex flex-col gap-1">
            <span className="text-xl whitespace-nowrap">{`$ ${current_price.toLocaleString()}`}</span>
            {price_change_percentage_24h && (
              <span
                className={clsx("text-right", {
                  "text-red-500": price_change_percentage_24h < 0,
                  "text-green-500": price_change_percentage_24h > 0,
                })}
              >{`${price_change_percentage_24h.toFixed(2)}%`}</span>
            )}
          </div>
        </header>
        <span className="text-gray-400 mt-2">{`Market cap: ${market_cap.toLocaleString()}`}</span>
        <footer className="flex justify-end mt-4">
          <Link
            className="bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-700 transition-all duration-300"
            to={`/coin/${id}`}
          >
            {"Details"}
          </Link>
        </footer>
      </div>
    </div>
  );
};
