import { Headphones, PlayCircle } from "lucide-react";

import { PageLayout } from "../components/PageLayout";

export function Music() {
  return (
    <PageLayout title="Music" description="Soundtracks for deep focus, relaxed evenings, and celebratory wins.">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Headphones size={20} />
        <div>
          <strong>Midnight maker playlist</strong>
          <p style={{ margin: 0, color: "var(--muted)" }}>Lofi beats, synthwave, and mellow energy for late-night flows.</p>
        </div>
      </div>
      <button className="btn" type="button" style={{ justifySelf: "start" }}>
        <PlayCircle size={16} style={{ marginRight: "8px" }} />
        Play now
      </button>
    </PageLayout>
  );
}
