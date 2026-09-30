import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DishCard from "../components/DishCard";
import { fetchSearchResults } from "../api/searchApi";

function EmptyState() {
  return (
    <div className="flex justify-center py-16">
      <svg width="180" height="180" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="90" fill="#e3efe1" />
        <rect x="24" y="78" width="56" height="72" rx="6" fill="#fff" stroke="#2f6b3a" strokeWidth="4" />
        <path d="M24 84 L24 78 L60 78 L68 90 L80 90" fill="none" stroke="#2f6b3a" strokeWidth="4" />
        <rect x="118" y="66" width="56" height="72" rx="6" fill="#fff" stroke="#2f6b3a" strokeWidth="4" />
        <path d="M118 72 L118 66 L154 66 L162 78 L174 78" fill="none" stroke="#2f6b3a" strokeWidth="4" />
        <circle cx="93" cy="93" r="32" fill="#fff" stroke="#2f6b3a" strokeWidth="7" />
        <line x1="117" y1="117" x2="146" y2="146" stroke="#2f6b3a" strokeWidth="8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(query);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setInputValue(query);
    if (!query) {
      setResults([]);
      setStatus("ready");
      return;
    }
    let alive = true;
    setStatus("loading");
    fetchSearchResults(query).then((data) => {
      if (alive) {
        setResults(data);
        setStatus("ready");
      }
    });
    return () => {
      alive = false;
    };
  }, [query]);

  const submit = () => {
    const q = inputValue.trim();
    if (!q) return;
    setSearchParams({ q });
  };

  return (
    <div className="mx-auto max-w-container px-4 py-8">
      <h2 className="mb-6 text-xl font-bold text-ink">
        {status === "ready" && results.length > 0
          ? `نتایج جستجو برای: ${query}`
          : "موردی با این مشخصات پیدا نکردیم!"}
      </h2>

      <div className="mb-8 flex items-center gap-2 rounded-full border border-line px-4 py-2.5 focus-within:border-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="جستجو"
          value={inputValue}
          data-rtl-listener="true"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-full bg-transparent text-sm focus:outline-none "
        />
      </div>

      {status === "loading" ? (
        <p className="py-10 text-center text-sm text-ink-muted">در حال جستجو...</p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((item) => (
            <DishCard key={item.id} item={item} fixedWidth={false} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

export default SearchResultsPage;
