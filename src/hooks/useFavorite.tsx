import { useState } from "react";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("favorites") || "[]"),
  );

  const toggle = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return { favorites, toggle };
};
