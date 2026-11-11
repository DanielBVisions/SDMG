import { colors } from "../theme";

// Slim modern phone for a 390x664 (CSS px) mobile viewport capture.
export const PhoneFrame: React.FC<{
  width: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width, children, style }) => {
  const bezel = Math.round(width * 0.03);
  const inner = width - bezel * 2;
  const screenH = Math.round(inner * (664 / 390));
  return (
    <div
      style={{
        width,
        padding: bezel,
        borderRadius: width * 0.15,
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
          borderRadius: width * 0.125,
          overflow: "hidden",
          backgroundColor: colors.white,
        }}
      >
        {children}
      </div>
    </div>
  );
};
