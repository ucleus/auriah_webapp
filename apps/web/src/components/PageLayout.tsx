import type { PropsWithChildren } from "react";

export function PageLayout({ title, description, children }: PropsWithChildren<{ title: string; description: string }>) {
  return (
    <section className="wrap" style={{ textAlign: "center", gap: "16px" }}>
      <h1 style={{ fontSize: "32px", margin: 0 }}>{title}</h1>
      <p style={{ color: "var(--muted)", maxWidth: "560px" }}>{description}</p>
      <div
        style={{
          background: "var(--card)",
          border: "1px solid #ffffff14",
          borderRadius: "16px",
          padding: "24px",
          width: "100%",
          maxWidth: "640px",
          textAlign: "left",
          display: "grid",
          gap: "16px",
        }}
      >
        {children}
      </div>
    </section>
  );
}
