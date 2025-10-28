import { NotebookPen, Tags } from "lucide-react";

import { PageLayout } from "../components/PageLayout";

export function Notes() {
  return (
    <PageLayout title="Notes" description="Capture sketches, meeting recaps, and ideas to revisit later.">
      <div>
        <h2 style={{ margin: "0 0 8px", display: "flex", alignItems: "center", gap: "8px" }}>
          <NotebookPen size={18} />
          Design standup recap
        </h2>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          Highlight progress, blockers, and inspiration from today's design reviews across squads.
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Tags size={16} />
        <span style={{ color: "var(--muted)" }}>Tags: product, ux, daily</span>
      </div>
    </PageLayout>
  );
}
