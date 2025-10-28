import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { ResultItem } from "../components/ResultItem";
import { SearchBar } from "../components/SearchBar";
import { SEARCH_RESULTS } from "../data/searchData";

export function Search() {
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";

  const filtered = useMemo(() => {
    const needle = query.toLowerCase().trim();
    if (!needle) return [];
    return SEARCH_RESULTS.filter((result) => {
      return (
        result.title.toLowerCase().includes(needle) ||
        result.snippet.toLowerCase().includes(needle) ||
        result.type.toLowerCase().includes(needle)
      );
    });
  }, [query]);

  return (
    <div className="wrap" style={{ alignItems: "stretch" }}>
      <SearchBar initialQuery={query} showActions={false} />
      <section className="results-list" aria-live="polite">
        {query && filtered.length === 0 && <p>No results yet. Try a different query.</p>}
        {filtered.map((result) => (
          <ResultItem key={result.id} result={result} />
        ))}
      </section>
    </div>
  );
}
