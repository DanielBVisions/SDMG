import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { clamp, smooth } from "../theme";

// Logo ident: resolves out of a blur, then slowly drifts towards camera.
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Intro" style={{ justifyContent: "center", alignItems: "center" }}>
      <Img
        src={staticFile("cbtax-logo.svg")}
        style={{
          width: 760,
          opacity: interpolate(frame, [0, 22], [0, 1], { ...clamp, easing: smooth }),
          filter: `blur(${interpolate(frame, [0, 30], [24, 0], { ...clamp, easing: smooth })}px)`,
          scale: interpolate(frame, [0, 40, 80], [1.18, 1, 0.97], {
            ...clamp,
            easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear],
          }),
          letterSpacing: interpolate(frame, [0, 40], [20, 0], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
