import "./App.css";
import { Routes, Route } from "react-router-dom";
import CoinChart from "./CoinChart";
import { Ticker } from "./components/Ticker";
import CryptoNews from "./CryptoNews";
import Header from "./layout/Header";
import { Home } from "./pages/home";

const App = () => {
  return (
    <>
      <Header renderNews={<CryptoNews />} />
      <div className="container">
        <Ticker />
        <Routes>
          <Route path="/" element={<Home renderNews={<CryptoNews />} />} />
          <Route path="/coin/:id" element={<CoinChart />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
