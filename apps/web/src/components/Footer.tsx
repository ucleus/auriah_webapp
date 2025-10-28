import { Link } from "react-router-dom";

const locales = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "fr", label: "Français" },
];

export function Footer() {
  return (
    <footer>
      <div className="left">
        <span>United States</span>
        <Link to="#">Advertising</Link>
        <Link to="#">Business</Link>
        <Link to="#">How Search works</Link>
      </div>
      <div className="right" aria-label="Language selector">
        {locales.map((locale) => (
          <Link key={locale.code} to="#">
            {locale.label}
          </Link>
        ))}
        <Link to="#">Settings</Link>
      </div>
    </footer>
  );
}
