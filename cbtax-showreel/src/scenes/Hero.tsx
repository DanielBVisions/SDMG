import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BrowserFrame } from "../components/BrowserFrame";
import { PhoneFrame } from "../components/PhoneFrame";
import { clamp, inOut, smooth } from "../theme";

const W = 1440;
const SCREEN_H = Math.round(W * (900 / 1440));

// Desktop rises out of a 3D tilt to face camera, scrolls hero -> stat cards,
// while the mobile hero floats in front for depth.
export const Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const land = Easing.bezier(0.22, 1, 0.36, 1);
  const rx = interpolate(frame, [0, 55], [32, 0], { ...clamp, easing: land });
  const rz = interpolate(frame, [0, 55], [-7, 0], { ...clamp, easing: land });
  const y = interpolate(frame, [0, 55], [220, 0], { ...clamp, easing: land });
  const push = interpolate(frame, [0, 55, 140], [0.82, 0.92, 0.98], { ...clamp, easing: [land, Easing.linear] });
  const scroll = interpolate(frame, [72, 104], [0, -SCREEN_H], { ...clamp, easing: inOut });

  return (
    <AbsoluteFill name="Hero" style={{ justifyContent: "center", alignItems: "center", perspective: 2600 }}>
      <div style={{ transform: `translateY(${y}px) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${push})`, transformStyle: "preserve-3d" }}>
        <BrowserFrame width={W}>
          <div style={{ position: "absolute", left: 0, width: W, translate: `0px ${scroll}px` }}>
            <Img src={staticFile("shots/d-hero.jpg")} style={{ width: W, height: SCREEN_H, display: "block" }} />
            <Img src={staticFile("shots/d-stats.jpg")} style={{ width: W, height: SCREEN_H, display: "block" }} />
          </div>
        </BrowserFrame>
      </div>
      <div
        style={{
          position: "absolute",
          right: 170,
          bottom: 40,
          opacity: interpolate(frame, [30, 48], [0, 1], clamp),
          transform: `translateY(${interpolate(frame, [30, 75, 140], [520, 0, -40], {
            ...clamp,
            easing: [smooth, Easing.linear],
          })}px) rotateZ(${interpolate(frame, [30, 140], [8, 3], clamp)}deg)`,
          filter: `blur(${interpolate(frame, [30, 60], [10, 0], clamp)}px)`,
        }}
      >
        <PhoneFrame width={280}>
          <Img src={staticFile("shots/m-hero.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};
