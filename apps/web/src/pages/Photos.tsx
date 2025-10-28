import { Image, Share2 } from "lucide-react";

import { PageLayout } from "../components/PageLayout";

export function Photos() {
  return (
    <PageLayout title="Photos" description="Collect your favourite captures and share albums effortlessly.">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Image size={20} />
        <div>
          <strong>Family adventure album</strong>
          <p style={{ margin: 0, color: "var(--muted)" }}>Smart highlights, captions, and vibrant colour grading.</p>
        </div>
      </div>
      <button className="btn" type="button" style={{ justifySelf: "start" }}>
        <Share2 size={16} style={{ marginRight: "8px" }} />
        Share album
      </button>
    </PageLayout>
  );
}
