import { AbsoluteFill, Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BrowserFrame } from "../components/BrowserFrame";
import { Accent, FeatureCaption } from "../components/FeatureCaption";
import { fontFamily } from "../theme";

const ease = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FRAME_W = 1120;
const SCREEN_H = Math.round(FRAME_W * (900 / 1440));

// 01: the move from a dark theme to a bold, light one. Hero, then a "scroll" down to the stat cards.
export const Redesign: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Redesign" style={{ fontFamily }}>
      <Backdrop />
      <FeatureCaption
        index="01  LIGHT, BOLD REDESIGN"
        title={
          <>
            Playful energy,
            <br />
            now in <Accent>light</Accent>
          </>
        }
        detail="A heavy dark theme reimagined to feel alive, modern and dynamic."
        style={{ position: "absolute", left: 110, top: 300, width: 600 }}
      />
      <Interactive.Div
        name="Browser"
        style={{
          position: "absolute",
          right: 90,
          top: 175,
          opacity: interpolate(frame, [0, 14], [0, 1], clamp),
          translate: interpolate(frame, [0, 30], ["120px 0px", "0px 0px"], { ...clamp, easing: Easing.spring({ damping: 200 }) }),
          rotate: interpolate(frame, [0, 30], ["2deg", "0deg"], { ...clamp, easing: Easing.spring({ damping: 200 }) }),
        }}
      >
        <BrowserFrame width={FRAME_W}>
          <div
            style={{
              position: "absolute",
              left: 0,
              width: FRAME_W,
              translate: interpolate(frame, [52, 82], ["0px 0px", `0px ${-SCREEN_H}px`], { ...clamp, easing: ease }),
            }}
          >
            <Img src={staticFile("shots/d-hero.jpg")} style={{ width: FRAME_W, height: SCREEN_H, display: "block" }} />
            <Img src={staticFile("shots/d-stats.jpg")} style={{ width: FRAME_W, height: SCREEN_H, display: "block" }} />
          </div>
        </BrowserFrame>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
