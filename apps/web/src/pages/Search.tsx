import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ResultItem } from "../components/ResultItem";
import { SearchBar } from "../components/SearchBar";
import { fetchSearchResults, type SearchResult } from "../api/search";

export function Search() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function runSearch(currentQuery: string) {
      const trimmed = currentQuery.trim();
      if (!trimmed) {
        setResults([]);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetchSearchResults(trimmed, controller.signal);
        setResults(response.results);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError((err as Error).message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    runSearch(query);

    return () => controller.abort();
  }, [query]);

  return (
    <div className="wrap" style={{ alignItems: "stretch" }}>
      <SearchBar initialQuery={query} showActions={false} />
      <section className="results-list" aria-live="polite">
        {loading && <p>Searching the Auirah index…</p>}
        {!loading && query && results.length === 0 && !error && <p>No results yet. Try a different query.</p>}
        {error && <p role="alert">{error}</p>}
        {results.map((result) => (
          <ResultItem key={result.id} result={result} />
        ))}
      </section>
    </div>
  );
}
