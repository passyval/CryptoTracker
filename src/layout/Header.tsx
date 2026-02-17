import { useEffect, useState } from "react";
import Navbar from "./Navbar";

interface HeaderProps {
  renderNews: React.ReactNode;
}

const Header = ({ renderNews }: HeaderProps) => {
  return (
    <header className="tv-header">
      <div className="tv-left">
        {renderNews}
        <Navbar />
      </div>
      <Cloack />
    </header>
  );
};

const Cloack = () => {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="tv-right">
      <div className="clock">{time}</div>
    </div>
  );
};

export default Header;
