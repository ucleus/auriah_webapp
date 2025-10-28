import { CheckCircle2, PlusCircle } from "lucide-react";

import { PageLayout } from "../components/PageLayout";

export function Tasks() {
  return (
    <PageLayout title="Tasks" description="Plan projects, routines, and quick reminders in one place.">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <CheckCircle2 size={20} />
        <div>
          <strong>Weekly planning session</strong>
          <p style={{ margin: 0, color: "var(--muted)" }}>Review next actions for each squad and align on goals.</p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <CheckCircle2 size={20} />
        <div>
          <strong>Ship the search experience</strong>
          <p style={{ margin: 0, color: "var(--muted)" }}>Polish autocomplete, voice search, and analytics hooks.</p>
        </div>
      </div>
      <button className="btn" type="button" style={{ justifySelf: "start" }}>
        <PlusCircle size={16} style={{ marginRight: "8px" }} />
        Add new task
      </button>
    </PageLayout>
  );
}
