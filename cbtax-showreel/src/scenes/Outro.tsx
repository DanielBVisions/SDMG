import { AbsoluteFill, Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { colors, fontFamily } from "../theme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Client quote from the Visions case study, then the credit.
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Outro" style={{ fontFamily }}>
      <Backdrop dark />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "0 220px" }}>
        <Interactive.Div
          name="Quote"
          style={{
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: -1.5,
            color: colors.white,
            textAlign: "center",
            opacity: interpolate(frame, [4, 18, 58, 68], [0, 1, 1, 0], { ...clamp, easing: ease }),
            translate: interpolate(frame, [4, 26, 58, 68], ["0px 40px", "0px 0px", "0px 0px", "0px -40px"], { ...clamp, easing: ease }),
          }}
        >
          “They were organised and <span style={{ color: colors.orange }}>highly knowledgeable</span> in their field.”
          <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: 0, marginTop: 36, color: "rgba(255,255,255,0.7)" }}>
            Ed Measey, Senior Operations, CBTax
          </div>
        </Interactive.Div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 40 }}>
        <Interactive.Div
          name="Logo"
          style={{
            opacity: interpolate(frame, [68, 80], [0, 1], clamp),
            scale: interpolate(frame, [68, 92], [0.9, 1], { ...clamp, easing: Easing.spring({ damping: 200 }), output: "perceptual-scale" }),
          }}
        >
          <Img src={staticFile("cbtax-logo-white.svg")} style={{ width: 560 }} />
        </Interactive.Div>
        <Interactive.Div
          name="Credit"
          style={{
            fontSize: 44,
            fontWeight: 600,
            color: colors.white,
            opacity: interpolate(frame, [76, 90], [0, 1], { ...clamp, easing: ease }),
            translate: interpolate(frame, [76, 96], ["0px 24px", "0px 0px"], { ...clamp, easing: ease }),
          }}
        >
          Designed &amp; built by <span style={{ color: colors.orange }}>Visions</span>
        </Interactive.Div>
        <Interactive.Div
          name="URL"
          style={{
            fontSize: 30,
            fontWeight: 500,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: 2,
            opacity: interpolate(frame, [84, 98], [0, 1], { ...clamp, easing: ease }),
          }}
        >
          cbtax.com
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
