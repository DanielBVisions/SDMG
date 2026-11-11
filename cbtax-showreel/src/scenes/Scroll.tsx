import { Video } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BrowserFrame } from "../components/BrowserFrame";
import { clamp, inOut } from "../theme";

const W = 1520;

// Real scroll capture of cbtax.com (sector carousel, service cards, stacked testimonials, team),
// on a slow orbiting camera.
export const Scroll: React.FC = () => {
  const frame = useCurrentFrame();
  const ry = interpolate(frame, [0, 150], [-9, 9], { ...clamp, easing: inOut });
  const rx = interpolate(frame, [0, 150], [6, 2], clamp);
  const s = interpolate(frame, [0, 150], [0.94, 1.02], clamp);
  return (
    <AbsoluteFill name="Scroll" style={{ justifyContent: "center", alignItems: "center", perspective: 2800 }}>
      <div style={{ transform: `rotateY(${ry}deg) rotateX(${rx}deg) scale(${s})` }}>
        <BrowserFrame width={W} style={{ boxShadow: "0 80px 160px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)" }}>
          <Video
            src={staticFile("video/desktop-scroll.mp4")}
            trimBefore={105}
            playbackRate={0.92}
            muted
            objectFit="cover"
            style={{ width: W, height: "100%" }}
          />
        </BrowserFrame>
      </div>
    </AbsoluteFill>
  );
};
