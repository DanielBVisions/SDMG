import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type GridMarqueeProps = {
  /** Screens (paths in public/), all 1440x800. */
  screens: string[];
  /** How many screens each row cycles through. */
  perRow: number;
  rows: number;
  /** Card size multiplier on 1440x800. */
  cardScale: number;
  gap: number;
  /** Tilt of the whole grid. */
  rotateZ: number;
  rotateX: number;
  perspective: number;
  background: string;
};

const SCREEN_W = 1440;
const SCREEN_H = 800;

// Each row slides along its own length, alternate rows in opposite directions. Over the
// composition every row moves exactly one full cycle of its screens, so the loop is seamless.
export const GridMarquee: React.FC<GridMarqueeProps> = ({
  screens,
  perRow,
  rows,
  cardScale,
  gap,
  rotateZ,
  rotateX,
  perspective,
  background,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const w = SCREEN_W * cardScale;
  const h = SCREEN_H * cardScale;
  const pitchX = w + gap;
  const pitchY = h + gap;
  const cycle = perRow * pitchX;
  const progress = frame / durationInFrames;
  // Draw wide enough to cover the frame once the grid is rotated.
  const span = 2600;

  return (
    <AbsoluteFill style={{ background, perspective, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`,
        }}
      >
        {Array.from({ length: rows }, (_, r) => {
          const row = r - Math.floor(rows / 2);
          const dir = r % 2 === 0 ? 1 : -1;
          // Each row gets its own run of screens, so neighbours don't match.
          const seq = Array.from(
            { length: perRow },
            (_, j) => screens[(r * 3 + j) % screens.length],
          );
          // Brick stagger + travel of one full cycle per loop.
          const offset = (row % 2) * (pitchX / 2) + dir * progress * cycle;
          const kFrom = Math.floor((-span - offset) / pitchX);
          const kTo = Math.ceil((span - offset) / pitchX);
          return Array.from({ length: kTo - kFrom + 1 }, (_, idx) => {
            const k = kFrom + idx;
            const src = seq[((k % perRow) + perRow) % perRow];
            return (
              <Img
                key={`${r}-${k}`}
                src={staticFile(src)}
                style={{
                  position: "absolute",
                  width: w,
                  height: h,
                  left: k * pitchX + offset - w / 2,
                  top: row * pitchY - h / 2,
                  borderRadius: 28 * cardScale * 1.6,
                  boxShadow: "0 30px 80px rgba(0,0,0,0.10), 0 6px 18px rgba(0,0,0,0.06)",
                  display: "block",
                }}
              />
            );
          });
        })}
      </div>
    </AbsoluteFill>
  );
};
