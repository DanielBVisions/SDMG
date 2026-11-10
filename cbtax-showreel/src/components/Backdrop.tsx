import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../theme";

// Soft lavender/peach glow, echoing the gradient orbs on cbtax.com.
export const Backdrop: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: dark ? colors.ink : colors.white, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          left: -350,
          top: -420,
          background: `radial-gradient(circle, ${colors.lavender} 0%, rgba(199,204,245,0) 65%)`,
          opacity: dark ? 0.25 : 0.9,
          translate: `${interpolate(frame, [0, 150], [0, 80])}px ${interpolate(frame, [0, 150], [0, 40])}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          right: -300,
          bottom: -450,
          background: `radial-gradient(circle, ${colors.peach} 0%, rgba(244,217,203,0) 65%)`,
          opacity: dark ? 0.2 : 0.9,
          translate: `${interpolate(frame, [0, 150], [0, -70])}px ${interpolate(frame, [0, 150], [0, -30])}px`,
        }}
      />
    </AbsoluteFill>
  );
};
