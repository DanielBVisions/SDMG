import { colors } from "../theme";

// Minimal browser chrome around a 16:10 site capture.
export const BrowserFrame: React.FC<{
  width: number;
  url?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width, url = "cbtax.com/en-us", children, style }) => {
  const barH = Math.round(width * 0.032);
  const screenH = Math.round(width * (900 / 1440));
  return (
    <div
      style={{
        width,
        borderRadius: 22,
        overflow: "hidden",
        backgroundColor: colors.white,
        boxShadow: "0 50px 120px rgba(29,29,32,0.22), 0 0 0 1px rgba(29,29,32,0.08)",
        ...style,
      }}
    >
      <div
        style={{
          height: barH,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 20px",
          backgroundColor: "#F4F4F4",
          borderBottom: "1px solid #E6E6E6",
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: c }} />
        ))}
        <div
          style={{
            marginLeft: 24,
            flex: 1,
            maxWidth: 520,
            height: barH * 0.6,
            borderRadius: 999,
            backgroundColor: colors.white,
            display: "flex",
            alignItems: "center",
            paddingLeft: 18,
            fontSize: barH * 0.36,
            color: colors.grey,
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ position: "relative", width, height: screenH, overflow: "hidden" }}>{children}</div>
    </div>
  );
};
