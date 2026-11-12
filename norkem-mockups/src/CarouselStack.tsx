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
  /** How far the side cards fade toward dimColor (0-1). */
  sideDim: number;
  /** Colour side cards fade toward: the background on light, black on dark. */
  dimColor: string;
  cardShadow: string;
  gap: number;
  /** Frames per item: the slow creep through centre plus the move to the next. */
  stepFrames: number;
  /** Share of each step spent creeping slowly through centre (0-1). */
  slowFraction: number;
  /** Creep speed as a share of a full step per step-length; also how far it creeps. */
  creep: number;
  background: string;
};

export const carouselDuration = (p: Pick<CarouselStackProps, "screens" | "stepFrames">) =>
  p.screens.length * p.stepFrames;

const ASPECT = 800 / 1440;
const moveEase = Easing.inOut(Easing.cubic);

// 0 -> 1 over a step. The step starts and ends in a slow creep, so a card arrives just below
// centre, keeps drifting slowly up through it, then eases off to the next. The eased move has
// zero speed at its ends, so the speed where creep meets move is the creep speed: no jolt, no
// stop, no reversal.
const creepCurve = (l: number, slowFraction: number, creep: number) => {
  const half = slowFraction / 2;
  const move = interpolate(l, [half, 1 - half], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: moveEase,
  });
  return creep * l + (1 - creep) * move;
};

// Cards travel up the column; each one arrives just below centre, creeps slowly up through
// it, then the column moves on.
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
  slowFraction,
  creep,
  background,
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const ring = [...screens, ...screens, ...screens];
  const n = ring.length;

  // Offset by half the slow window so frame 0 is a card dead centre mid-creep.
  const f = frame + (slowFraction / 2) * stepFrames;
  const step = Math.floor(f / stepFrames);
  const t = creepCurve((f - step * stepFrames) / stepFrames, slowFraction, creep);
  // Shift so the creep is centred on each card: centre is passed half way through the creep.
  const scroll = step + t - (creep * slowFraction) / 2;

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
