import { useEffect, useState } from "react";

import { Logo } from "../components/Logo";
import { QuickApps } from "../components/QuickApps";
import { SearchBar } from "../components/SearchBar";
import { getGreeting } from "../utils/time";

export function Home() {
  const [greeting, setGreeting] = useState(() => getGreeting());

  useEffect(() => {
    const id = window.setInterval(() => {
      setGreeting(getGreeting());
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="wrap" style={{ margin: "auto" }}>
      <Logo />
      <div className="greeting" aria-live="polite">
        {greeting}
      </div>
      <SearchBar showActions initialQuery="" />
      <QuickApps />
    </div>
  );
}
