import { AbsoluteFill, Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { colors, fontFamily } from "../theme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Intro" style={{ fontFamily }}>
      <Backdrop />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 48,
          scale: interpolate(frame, [0, 75], [1, 1.05], clamp),
        }}
      >
        <Interactive.Div
          name="Logo"
          style={{
            opacity: interpolate(frame, [0, 14], [0, 1], clamp),
            scale: interpolate(frame, [0, 28], [0.85, 1], { ...clamp, easing: Easing.spring({ damping: 200 }), output: "perceptual-scale" }),
            filter: `blur(${interpolate(frame, [0, 18], [16, 0], clamp)}px)`,
          }}
        >
          <Img src={staticFile("cbtax-logo.svg")} style={{ width: 720 }} />
        </Interactive.Div>
        <Interactive.Div
          name="Tagline"
          style={{
            fontSize: 44,
            fontWeight: 600,
            color: colors.ink,
            letterSpacing: 1,
            opacity: interpolate(frame, [20, 36], [0, 1], { ...clamp, easing: ease }),
            translate: interpolate(frame, [20, 40], ["0px 24px", "0px 0px"], { ...clamp, easing: ease }),
          }}
        >
          Website design &amp; build
        </Interactive.Div>
        <Interactive.Div
          name="Tags"
          style={{
            display: "flex",
            gap: 16,
            opacity: interpolate(frame, [30, 46], [0, 1], { ...clamp, easing: ease }),
            translate: interpolate(frame, [30, 50], ["0px 24px", "0px 0px"], { ...clamp, easing: ease }),
          }}
        >
          {["UX/UI", "Webflow", "Localisation"].map((t) => (
            <div
              key={t}
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: colors.ink,
                padding: "12px 30px",
                borderRadius: 999,
                border: `2px solid ${colors.ink}`,
              }}
            >
              {t}
            </div>
          ))}
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
