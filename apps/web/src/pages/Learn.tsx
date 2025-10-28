import { BookOpen, Sparkles } from "lucide-react";

import { PageLayout } from "../components/PageLayout";

export function Learn() {
  return (
    <PageLayout title="Learn" description="Curated courses and articles to keep curiosity thriving.">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <BookOpen size={20} />
        <div>
          <strong>Build a design system sprint</strong>
          <p style={{ margin: 0, color: "var(--muted)" }}>Daily lessons, practical worksheets, and async critiques.</p>
        </div>
      </div>
      <button className="btn" type="button" style={{ justifySelf: "start" }}>
        <Sparkles size={16} style={{ marginRight: "8px" }} />
        View learning path
      </button>
    </PageLayout>
  );
}
