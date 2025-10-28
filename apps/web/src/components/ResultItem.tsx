import { ExternalLink, Link2 } from "lucide-react";
import { Link } from "react-router-dom";

import type { SearchResult } from "../data/searchData";

export function ResultItem({ result }: { result: SearchResult }) {
  const isInternal = result.href.startsWith("/");
  const Icon = isInternal ? Link2 : ExternalLink;

  const content = isInternal ? (
    <Link to={result.href}>{result.title}</Link>
  ) : (
    <a href={result.href} target="_blank" rel="noopener noreferrer">
      {result.title}
    </a>
  );

  return (
    <article className="result-item">
      <div className="type-chip">
        <Icon size={14} />
        <span>{result.type}</span>
      </div>
      <h2>{content}</h2>
      <p className="result-snippet">{result.snippet}</p>
    </article>
  );
}
