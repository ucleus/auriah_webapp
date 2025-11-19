import type { PropsWithChildren } from "react";

type PageLayoutProps = PropsWithChildren<{
  title: string;
  description: string;
  fullWidth?: boolean;
  transparent?: boolean;
}>;

export function PageLayout({ title, description, children, fullWidth = false, transparent = false }: PageLayoutProps) {
  return (
    <section
      className="wrap"
      style={{
        textAlign: "center",
        gap: "16px",
        maxWidth: fullWidth ? "1200px" : undefined,
        width: "100%",
      }}
    >
      <h1 style={{ fontSize: "32px", margin: 0 }}>{title}</h1>
      <p style={{ color: "var(--muted)", maxWidth: "560px" }}>{description}</p>
      <div
        style={{
          background: transparent ? "transparent" : "var(--card)",
          border: transparent ? "none" : "1px solid #ffffff14",
          borderRadius: "16px",
          padding: transparent ? "0" : "24px",
          width: "100%",
          maxWidth: fullWidth ? "1200px" : "640px",
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
