import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type CarouselStackProps = {
  /** Screens (paths in public/), 1440x800. */
  screens: string[];
  /** Width of the centre card in px. */
  cardWidth: number;
  /** Scale of the cards above and below centre. */
  sideScale: number;
  /** How dark the side cards get (0-1). */
  sideDim: number;
  gap: number;
  /** Frames per item: the hold at centre plus the move to the next. */
  stepFrames: number;
  holdFrames: number;
  background: string;
};

export const carouselDuration = (p: Pick<CarouselStackProps, "screens" | "stepFrames">) =>
  p.screens.length * p.stepFrames;

const ASPECT = 800 / 1440;
const ease = Easing.bezier(0.7, 0, 0.2, 1);

// Cards travel up the column; each one stops dead centre, holds, then the column moves on.
// The deck is repeated so a card never visibly jumps from top to bottom, and the column moves
// exactly one deck per loop, so the loop is seamless.
export const CarouselStack: React.FC<CarouselStackProps> = ({
  screens,
  cardWidth,
  sideScale,
  sideDim,
  gap,
  stepFrames,
  holdFrames,
  background,
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const ring = [...screens, ...screens, ...screens];
  const n = ring.length;

  const step = Math.floor(frame / stepFrames);
  const t = interpolate(frame - step * stepFrames, [holdFrames, stepFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
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
                background: "#000",
                opacity: a * sideDim,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
