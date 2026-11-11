import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { clamp, smooth } from "../theme";

// End ident: logo resolves and holds.
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Outro" style={{ justifyContent: "center", alignItems: "center" }}>
      <Img
        src={staticFile("cbtax-logo.svg")}
        style={{
          width: 640,
          opacity: interpolate(frame, [6, 26], [0, 1], { ...clamp, easing: smooth }),
          filter: `blur(${interpolate(frame, [6, 34], [18, 0], { ...clamp, easing: smooth })}px)`,
          scale: interpolate(frame, [6, 90], [0.92, 1], { ...clamp, easing: smooth }),
        }}
      />
    </AbsoluteFill>
  );
};
