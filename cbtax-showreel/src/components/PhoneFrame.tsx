import { colors } from "../theme";

// Modern phone (19.5:9) for a 390x844 (CSS px) mobile viewport capture.
export const PhoneFrame: React.FC<{
  width: number;
  /** Status bar colour, matching the top of the page (Safari tints it). */
  statusBar?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width, statusBar = colors.white, children, style }) => {
  const bezel = Math.round(width * 0.035);
  const inner = width - bezel * 2;
  const screenH = Math.round(inner * (844 / 390));
  return (
    <div
      style={{
        width,
        padding: bezel,
        borderRadius: width * 0.17,
        backgroundColor: colors.ink,
        boxShadow: "0 60px 120px rgba(29,29,32,0.3), inset 0 0 0 2px rgba(255,255,255,0.12)",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: inner,
          height: screenH,
          borderRadius: width * 0.14,
          overflow: "hidden",
          backgroundColor: statusBar,
        }}
      >
        {/* Page content sits below the status bar, as in mobile Safari */}
        <div style={{ position: "absolute", top: inner * 0.13, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>{children}</div>
        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: inner * 0.03,
            left: "50%",
            translate: "-50% 0",
            width: inner * 0.3,
            height: inner * 0.085,
            borderRadius: 999,
            backgroundColor: "#000",
          }}
        />
      </div>
    </div>
  );
};
