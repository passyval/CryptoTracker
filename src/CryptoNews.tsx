import { useQuery } from "@tanstack/react-query";

const CryptoNews = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["crypto-news"],
    queryFn: async () =>
      (await fetch(
        "https://gnews.io/api/v4/search?q=crypto&lang=en&max=8&token=511fd619dd3931db388eeaa4d39801a1"
      )).json().then(r => r.articles),
    staleTime: 300000,
  });

  if (isLoading) return <div>Caricamento news...</div>;
  if (isError) return <div>Errore nel caricamento</div>;

  return (
    <div className="news card">
      <h3 className="panel-title">📰 News Crypto</h3>
      <ul className="news-list">
        {data.map((n: any, i: number) => (
          <li key={i} className="news-item">
            <a href={n.url} target="_blank">
              <div className="news-title">{n.title}</div>
              <div className="news-meta">
                {n.source.name} • {new Date(n.publishedAt).toLocaleDateString("it-IT")}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CryptoNews;
