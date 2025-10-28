import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ThemeToggle } from "./ThemeToggle";
import { formatTime } from "../utils/time";

export function Header() {
  const [time, setTime] = useState(() => formatTime());

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(formatTime());
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setTime(formatTime());
  }, []);

  return (
    <header>
      <nav className="left" aria-label="Primary">
        <Link to="#">About</Link>
        <Link to="#">Auirah Apps</Link>
        <Link to="#">Privacy</Link>
      </nav>
      <div className="apps">
        <span className="chip" aria-live="polite">
          {time}
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
