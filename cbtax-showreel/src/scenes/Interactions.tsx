import { Video } from "@remotion/media";
import { AbsoluteFill, Easing, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BrowserFrame } from "../components/BrowserFrame";
import { Accent, FeatureCaption } from "../components/FeatureCaption";
import { fontFamily } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FRAME_W = 1120;

// 02: real scroll capture of cbtax.com: tilting sector cards, service cards, stacked testimonials.
export const Interactions: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Interactions" style={{ fontFamily }}>
      <Backdrop dark />
      <FeatureCaption
        dark
        index="02  USER INTERACTIONS"
        title={
          <>
            Motion on
            <br />
            <Accent>every scroll</Accent>
          </>
        }
        detail="Micro-animations turn a finance site into one people enjoy exploring."
        style={{ position: "absolute", left: 110, top: 300, width: 600 }}
      />
      <Interactive.Div
        name="Browser"
        style={{
          position: "absolute",
          right: 90,
          top: 175,
          scale: interpolate(frame, [0, 120], [1, 1.03], clamp),
          translate: interpolate(frame, [0, 30], ["0px 80px", "0px 0px"], { ...clamp, easing: Easing.spring({ damping: 200 }) }),
        }}
      >
        <BrowserFrame width={FRAME_W}>
          <Video
            src={staticFile("video/desktop-scroll.mp4")}
            trimBefore={108}
            playbackRate={1.4}
            muted
            objectFit="cover"
            style={{ width: FRAME_W, height: "100%" }}
          />
        </BrowserFrame>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
