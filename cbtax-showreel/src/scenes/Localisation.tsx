import { AbsoluteFill, Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BrowserFrame } from "../components/BrowserFrame";
import { Accent, FeatureCaption } from "../components/FeatureCaption";
import { colors, fontFamily } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FRAME_W = 1120;
const STEP = 22; // frames per market

const markets = [
  { label: "UK", url: "cbtax.com", src: "shots/loc-uk.jpg" },
  { label: "Ireland", url: "cbtax.com/ga-ie", src: "shots/loc-ie.jpg" },
  { label: "USA", url: "cbtax.com/en-us", src: "shots/loc-us.jpg" },
  { label: "UAE", url: "cbtax.com/en-ae", src: "shots/loc-ae.jpg" },
];

// 04: Webflow localisation: one site, tailored per market.
export const Localisation: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.min(markets.length - 1, Math.max(0, Math.floor((frame - 10) / STEP)));
  return (
    <AbsoluteFill name="Localisation" style={{ fontFamily }}>
      <Backdrop />
      <FeatureCaption
        index="04  GLOBAL LOCALISATION"
        title={
          <>
            One site,
            <br />
            <Accent>four markets</Accent>
          </>
        }
        detail="Webflow localisation tailors the experience to each location and audience."
        style={{ position: "absolute", left: 110, top: 240, width: 600 }}
      />
      <Interactive.Div
        name="Market pills"
        style={{
          position: "absolute",
          left: 110,
          top: 720,
          display: "flex",
          gap: 14,
          opacity: interpolate(frame, [20, 34], [0, 1], clamp),
        }}
      >
        {markets.map((m, i) => (
          <div
            key={m.label}
            style={{
              fontSize: 30,
              fontWeight: 700,
              padding: "14px 28px",
              borderRadius: 999,
              border: `2px solid ${i === active ? colors.orange : "rgba(29,29,32,0.2)"}`,
              backgroundColor: i === active ? colors.orange : "transparent",
              color: i === active ? colors.white : colors.ink,
            }}
          >
            {m.label}
          </div>
        ))}
      </Interactive.Div>
      <Interactive.Div
        name="Browser"
        style={{
          position: "absolute",
          right: 90,
          top: 175,
          translate: interpolate(frame, [0, 30], ["0px 80px", "0px 0px"], { ...clamp, easing: Easing.spring({ damping: 200 }) }),
        }}
      >
        <BrowserFrame width={FRAME_W} url={markets[active].url}>
          {markets.map((m, i) => (
            <Img
              key={m.src}
              src={staticFile(m.src)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: i === 0 ? 1 : interpolate(frame, [10 + i * STEP, 10 + i * STEP + 6], [0, 1], clamp),
              }}
            />
          ))}
        </BrowserFrame>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
