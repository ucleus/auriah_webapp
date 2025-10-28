import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <section className="wrap" style={{ gap: "16px", textAlign: "center" }}>
      <h1 style={{ margin: 0 }}>Page not found</h1>
      <p style={{ color: "var(--muted)" }}>The page you were looking for has moved. Head back to the homepage to keep exploring.</p>
      <Link className="btn" to="/">
        Return home
      </Link>
    </section>
  );
}
