import { Compass, MapPinned, Route } from "lucide-react";

import { PageLayout } from "../components/PageLayout";

export function Maps() {
  return (
    <PageLayout title="Maps" description="Navigate adventures with precise routing and offline guides.">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <MapPinned size={20} />
        <div>
          <strong>Weekend ride scouting</strong>
          <p style={{ margin: 0, color: "var(--muted)" }}>Pin scenic stops and refuel points for the next coastal cruise.</p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Route size={20} />
        <div>
          <strong>Optimal route preview</strong>
          <p style={{ margin: 0, color: "var(--muted)" }}>Compare estimated travel times and see live weather overlays.</p>
        </div>
      </div>
      <button className="btn" type="button" style={{ justifySelf: "start" }}>
        <Compass size={16} style={{ marginRight: "8px" }} />
        Start navigation
      </button>
    </PageLayout>
  );
}
