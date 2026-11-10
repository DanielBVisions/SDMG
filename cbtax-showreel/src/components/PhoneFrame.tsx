import { colors } from "../theme";

// iPhone-style frame for a 390x664 (CSS px) mobile viewport capture.
export const PhoneFrame: React.FC<{
  width: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width, children, style }) => {
  const bezel = Math.round(width * 0.04);
  const inner = width - bezel * 2;
  const screenH = Math.round(inner * (664 / 390));
  return (
    <div
      style={{
        width,
        padding: bezel,
        borderRadius: width * 0.16,
        backgroundColor: colors.ink,
        boxShadow: "0 50px 100px rgba(29,29,32,0.28)",
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
