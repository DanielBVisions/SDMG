import { colors } from "../theme";

// Minimal browser chrome (no text) around a 16:10 site capture.
export const BrowserFrame: React.FC<{
  width: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width, children, style }) => {
  const barH = Math.round(width * 0.028);
  const screenH = Math.round(width * (900 / 1440));
  const dot = Math.round(barH * 0.32);
  return (
    <div
      style={{
        width,
        borderRadius: width * 0.016,
        overflow: "hidden",
        backgroundColor: colors.white,
        boxShadow: "0 60px 140px rgba(29,29,32,0.28), 0 0 0 1px rgba(29,29,32,0.08)",
        ...style,
      }}
    >
      <div
        style={{
          height: barH,
          display: "flex",
          alignItems: "center",
          gap: dot * 0.7,
          padding: `0 ${barH * 0.6}px`,
          backgroundColor: "#F3F3F4",
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: dot, height: dot, borderRadius: dot, backgroundColor: c }} />
        ))}
        <div style={{ margin: "0 auto", width: width * 0.28, height: barH * 0.52, borderRadius: 999, backgroundColor: "#E6E6E8" }} />
      </div>
      <div style={{ position: "relative", width, height: screenH, overflow: "hidden" }}>{children}</div>
    </div>
  );
};
