import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BrowserFrame } from "../components/BrowserFrame";
import { clamp } from "../theme";

const W = 1180;
const markets = ["shots/loc-uk.jpg", "shots/loc-ie.jpg", "shots/loc-us.jpg", "shots/loc-ae.jpg"];

// Cover-flow of the UK, Ireland, USA and UAE versions; the camera glides from one to the next.
export const Localisation: React.FC = () => {
  const frame = useCurrentFrame();
  const glide = Easing.bezier(0.65, 0, 0.35, 1);
  // Position along the carousel: rests on each market, glides between them.
  const t = interpolate(frame, [0, 18, 40, 50, 72, 82, 104, 120], [-0.15, 0, 1, 1, 2, 2, 3, 3.1], {
    ...clamp,
    easing: glide,
  });
  return (
    <AbsoluteFill name="Localisation" style={{ justifyContent: "center", alignItems: "center", perspective: 2400 }}>
      {markets.map((src, i) => {
        const d = i - t;
        const a = Math.abs(d);
        return (
          <div
            key={src}
            style={{
              position: "absolute",
              zIndex: 100 - Math.round(a * 10),
              opacity: interpolate(a, [0, 1.2, 2.2], [1, 0.75, 0], clamp),
              filter: `blur(${interpolate(a, [0, 1.5], [0, 6], clamp)}px)`,
              transform: `translateX(${d * 780}px) translateZ(${-a * 380}px) rotateY(${interpolate(d, [-2, 0, 2], [50, 0, -50], clamp)}deg)`,
            }}
          >
            <BrowserFrame width={W}>
              <Img src={staticFile(src)} style={{ width: "100%", height: "100%", display: "block" }} />
            </BrowserFrame>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
