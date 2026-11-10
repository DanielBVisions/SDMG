import { AbsoluteFill, Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Accent, FeatureCaption } from "../components/FeatureCaption";
import { PhoneFrame } from "../components/PhoneFrame";
import { fontFamily } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PHONE_W = 330;

const phones = [
  { src: "shots/m-hero.jpg", delay: 0, lift: 40 },
  { src: "shots/m-quote-orange.jpg", delay: 7, lift: -30 },
  { src: "shots/m-sectors.jpg", delay: 14, lift: 60 },
];

// 03: the same experience, fully intact on mobile.
export const Mobile: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill name="Mobile" style={{ fontFamily }}>
      <Backdrop />
      <FeatureCaption
        index="03  MOBILE RESPONSIVE"
        title={
          <>
            Flawless on
            <br />
            <Accent>every device</Accent>
          </>
        }
        detail="Four countries, many time zones. Bold visuals and smooth motion stay intact."
        style={{ position: "absolute", left: 110, top: 300, width: 620 }}
      />
      <div style={{ position: "absolute", right: 110, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 44 }}>
        {phones.map((p, i) => (
          <Interactive.Div
            key={p.src}
            name={`Phone ${i + 1}`}
            style={{
              opacity: interpolate(frame, [p.delay, p.delay + 12], [0, 1], clamp),
              translate: interpolate(
                frame,
                [p.delay, p.delay + 34, 120],
                ["0px 500px", `0px ${p.lift}px`, `0px ${p.lift - 30}px`],
                { ...clamp, easing: [Easing.spring({ damping: 18, mass: 0.8 }), Easing.linear] },
              ),
            }}
          >
            <PhoneFrame width={PHONE_W}>
              <Img src={staticFile(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </PhoneFrame>
          </Interactive.Div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
