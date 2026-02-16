import { useEffect, useState } from "react";
import "./App.css";

interface NewsItem {
  title: string;
  url: string;
  source: string;
  published_at: string;
}

export default function CryptoNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/news"
        );
        const json = await res.json();
        setNews(json.data.slice(0, 8)); // prime 8 news
      } catch (e) {
        console.error("Errore news:", e);
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  return (
    <div className="news card">
      <h3 className="panel-title">📰 News Crypto</h3>

      {loading ? (
        <div className="loading">Caricamento news...</div>
      ) : (
        <ul className="news-list">
          {news.map((n, i) => (
            <li key={i} className="news-item">
              <a href={n.url} target="_blank" rel="noopener noreferrer">
                <div className="news-title">{n.title}</div>
                <div className="news-meta">
                  {n.source} • {new Date(n.published_at).toLocaleDateString()}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
