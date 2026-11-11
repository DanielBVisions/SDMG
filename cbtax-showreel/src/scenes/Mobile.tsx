import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { PhoneFrame } from "../components/PhoneFrame";
import { clamp } from "../theme";

const PHONE_W = 330;
const phones = [
  { src: "shots/m-quote-blue.jpg", lift: 70 },
  { src: "shots/m-hero.jpg", lift: -20 },
  { src: "shots/m-quote-orange.jpg", lift: 40 },
  { src: "shots/m-sectors.jpg", lift: -50 },
];

// Row of phones rising in a wave, angled in 3D, drifting sideways like a carousel.
export const Mobile: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = Easing.bezier(0.22, 1, 0.36, 1);
  const driftX = interpolate(frame, [0, 140], [140, -140], clamp);
  return (
    <AbsoluteFill name="Mobile" style={{ justifyContent: "center", alignItems: "center", perspective: 2200 }}>
      <div
        style={{
          display: "flex",
          gap: 60,
          alignItems: "center",
          transform: `translateX(${driftX}px) rotateY(${interpolate(frame, [0, 140], [-14, -6], clamp)}deg) rotateX(6deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {phones.map((p, i) => {
          const d = i * 6;
          return (
            <div
              key={p.src}
              style={{
                opacity: interpolate(frame, [d, d + 14], [0, 1], clamp),
                transform: `translateY(${interpolate(frame, [d, d + 45, 140], [640, p.lift, p.lift - 36], {
                  ...clamp,
                  easing: [rise, Easing.linear],
                })}px) rotateZ(${interpolate(frame, [d, d + 45], [6, 0], { ...clamp, easing: rise })}deg)`,
              }}
            >
              <PhoneFrame width={PHONE_W}>
                <Img src={staticFile(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </PhoneFrame>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
