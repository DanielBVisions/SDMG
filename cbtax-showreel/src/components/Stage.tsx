import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, colors, START, TRANSITION, SCENES } from "../theme";

// One continuous background for the whole reel, so transitions only move the devices.
// Fades to the site's dark ink for the scroll scene (matching its dark testimonial/team sections).
export const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const darkIn = START[2];
  const darkOut = START[2] + SCENES.scroll - TRANSITION;
  const dark = interpolate(frame, [darkIn, darkIn + TRANSITION, darkOut, darkOut + TRANSITION], [0, 1, 1, 0], clamp);
  const drift = (a: number, b: number) => interpolate(frame, [0, 600], [a, b]);
  return (
    <AbsoluteFill style={{ backgroundColor: colors.white, overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundColor: colors.ink, opacity: dark }} />
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          borderRadius: "50%",
          left: -500,
          top: -600,
          background: `radial-gradient(circle, ${colors.lavender} 0%, rgba(199,204,245,0) 65%)`,
          opacity: 0.9 - dark * 0.65,
          translate: `${drift(0, 380)}px ${drift(0, 160)}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          right: -450,
          bottom: -650,
          background: `radial-gradient(circle, ${colors.peach} 0%, rgba(244,217,203,0) 65%)`,
          opacity: 0.95 - dark * 0.7,
          translate: `${drift(0, -320)}px ${drift(0, -140)}px`,
        }}
      />
    </AbsoluteFill>
  );
};
