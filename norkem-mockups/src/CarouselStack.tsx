import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { stepCurve } from "./OrbitRing";

export type CarouselStackProps = {
  /** Screens (paths in public/), 1440x800. */
  screens: string[];
  /** Width of the centre card in px. */
  cardWidth: number;
  /** Scale of the cards above and below centre. */
  sideScale: number;
  /** How far the side cards fade toward dimColor (0-1). */
  sideDim: number;
  /** Colour side cards fade toward: the background on light, black on dark. */
  dimColor: string;
  cardShadow: string;
  gap: number;
  /** Frames per item: the move, the slight overshoot and the settle at centre. */
  stepFrames: number;
  /** Spring damping ratio. Lower = bigger overshoot. 0.7 ~= 3.5% past centre. */
  damping: number;
  /** Spring frequency. Higher = arrives sooner, leaving a longer stop at centre. */
  stiffness: number;
  /** Small constant creep so the column never fully stops. */
  drift: number;
  background: string;
};

export const carouselDuration = (p: Pick<CarouselStackProps, "screens" | "stepFrames">) =>
  p.screens.length * p.stepFrames;

const ASPECT = 800 / 1440;

// Cards travel up the column; each one swings slightly past centre, settles there, then the
// column moves on (same spring motion as the orbit).
// The deck is repeated so a card never visibly jumps from top to bottom, and the column moves
// exactly one deck per loop, so the loop is seamless.
export const CarouselStack: React.FC<CarouselStackProps> = ({
  screens,
  cardWidth,
  sideScale,
  sideDim,
  dimColor,
  cardShadow,
  gap,
  stepFrames,
  damping,
  stiffness,
  drift,
  background,
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const ring = [...screens, ...screens, ...screens];
  const n = ring.length;

  const step = Math.floor(frame / stepFrames);
  const t = stepCurve((frame - step * stepFrames) / stepFrames, damping, stiffness, drift);
  const scroll = step + t;

  const h = cardWidth * ASPECT;
  const hSide = h * sideScale;
  // Distance between the centre card and its neighbour, and between neighbours further out.
  const firstPitch = h / 2 + gap + hSide / 2;
  const pitch = hSide + gap;

  const yAt = (p: number) => {
    const a = Math.abs(p);
    const d = a <= 1 ? a * firstPitch : firstPitch + (a - 1) * pitch;
    return Math.sign(p) * d;
  };

  const wrap = (v: number) => ((((v + n / 2) % n) + n) % n) - n / 2;

  return (
    <AbsoluteFill style={{ background, overflow: "hidden" }}>
      {ring.map((src, i) => {
        const p = wrap(i - scroll);
        const a = Math.min(Math.abs(p), 1);
        const scale = 1 - (1 - sideScale) * a;
        const y = yAt(p);
        if (Math.abs(y) - (h * scale) / 2 > height / 2 + 50) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: cardWidth,
              height: h,
              marginLeft: -cardWidth / 2,
              marginTop: -h / 2,
              transform: `translateY(${y}px) scale(${scale})`,
              borderRadius: 22 / scale,
              overflow: "hidden",
              boxShadow: cardShadow,
            }}
          >
            <Img
              src={staticFile(src)}
              style={{ width: cardWidth, height: h, display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: dimColor,
                opacity: a * sideDim,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
