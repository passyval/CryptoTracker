import { useEffect, useState } from "react";

interface HeaderProps {
  renderNews: React.ReactNode;
}

const Header = ({ renderNews }: HeaderProps) => {
  const [time, setTime] = useState<string>(() =>
    new Date().toLocaleTimeString(),
  );

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="tv-header">
      <div className="tv-left">
        <nav className="nav">
          {renderNews}
          <button className="nav-btn active">Mercato</button>
          <button className="nav-btn">Preferiti</button>
          <button className="nav-btn">Portafoglio</button>
        </nav>
      </div>
      <div className="tv-right">
        <div className="clock">{time}</div>
      </div>
    </header>
  );
};

export default Header;
