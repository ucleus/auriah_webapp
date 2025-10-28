import { useTheme } from "../context/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <label title="Toggle light or dark mode">
      <input
        className="toggle"
        type="checkbox"
        checked={isLight}
        onChange={(event) => setTheme(event.target.checked ? "light" : "dark")}
        aria-label="Toggle light or dark theme"
      />
    </label>
  );
}
