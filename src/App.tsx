import "./App.css";
import { Routes, Route } from "react-router-dom";
import CoinChart from "./CoinChart";
import { Ticker } from "./components/Ticker";      
import Header from "./layout/Header";
import { Home } from "./pages/home";              
import Favorite from "./pages/home/Favorite";      
import CryptoNews from "./CryptoNews";

const App = () => {
  return (
    <>
      <Header renderNews={null} />

      <div className="container">
        <Ticker />

        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={<Home renderNews={<CryptoNews />} />}
          />

          {/* Coin Chart */}
          <Route path="/coin/:id" element={<CoinChart />} />

          {/* Preferiti */}
          <Route path="/favorites" element={<Favorite />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
