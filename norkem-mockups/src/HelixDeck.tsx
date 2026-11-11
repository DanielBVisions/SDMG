import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BrandCard } from "./BrandCard";
import { CARD_HEIGHT, CARD_WIDTH, CardDef } from "./cards";

export type HelixDeckProps = {
  cards: CardDef[];
  /** "stepped" settles each card face-on (storyboard style); "continuous" never stops. */
  motion: "stepped" | "continuous";
  /** Frames per card advance. */
  stepFrames: number;
  /** Stepped only: frames each card holds face-on before moving on. */
  holdFrames: number;
  /** Degrees of twist (around the vertical axis) between neighbouring cards. */
  twist: number;
  /** Vertical distance between card centres, in px (after scaling). */
  pitch: number;
  /** Card size multiplier; 1 = 1440x850. Keeps the aspect ratio. */
  cardScale: number;
  /** "up" = deck travels upward, "down" = deck travels downward. */
  direction: "up" | "down";
  /** Extra motion: forward tilt, depth push and whole-column sway. 0 = none. */
  extraRotation: number;
  perspective: number;
  background: string;
  /** CSS box-shadow for each card. */
  cardShadow: string;
  /** Extra px of column drawn above/below the frame (e.g. while a transition slides it). */
  overscan?: number;
  /**
   * From this frame on, only cards that were on screen at this frame are drawn, so the column
   * ends cleanly (whole cards, nothing new arriving) while a transition carries it away.
   */
  endColumnAtFrame?: number;
};

export const helixDuration = (p: Pick<HelixDeckProps, "cards" | "stepFrames">) =>
  p.cards.length * p.stepFrames;

const ease = Easing.bezier(0.65, 0, 0.35, 1);

// Scroll position in "cards". Goes 0 -> N over the composition, so the last
// frame flows straight into the first and the loop is seamless.
const scrollAt = (frame: number, p: HelixDeckProps) => {
  if (p.motion === "continuous") return frame / p.stepFrames;
  const k = Math.floor(frame / p.stepFrames);
  const local = frame - k * p.stepFrames;
  const t = interpolate(local, [p.holdFrames, p.stepFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  return k + t;
};

// Wrap a card offset into [-n/2, n/2) so cards recycle around the loop.
const wrap = (v: number, n: number) => ((((v + n / 2) % n) + n) % n) - n / 2;

export const HelixDeck: React.FC<HelixDeckProps> = (props) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const { cards, twist, pitch, cardScale, direction, extraRotation, background } =
    props;
  const n = cards.length;
  const scroll = scrollAt(frame, props);
  const dir = direction === "down" ? -1 : 1;
  const flat = extraRotation === 0;

  // Optional slow sway of the whole column; one sine period per loop so it stays seamless.
  const phase = (frame / durationInFrames) * Math.PI * 2;
  const sway = Math.sin(phase) * 3 * extraRotation;
  const lean = Math.cos(phase) * 4 * extraRotation;

  const overscan = props.overscan ?? 0;
  const reach = (height / 2 + overscan) / pitch + 1;

  // Cards that overlap the frame at the column's end frame (see endColumnAtFrame).
  const endFrame = props.endColumnAtFrame;
  const keep =
    endFrame !== undefined && frame >= endFrame
      ? new Set(
          cards
            .map((_, i) => i)
            .filter((i) => {
              const p = wrap(i - scrollAt(endFrame, props), n);
              return Math.abs(p) * pitch < (height + CARD_HEIGHT * cardScale) / 2;
            }),
        )
      : null;

  const visible = cards
    .map((card, i) => ({ card, i, p: wrap(i - scroll, n) }))
    .filter(({ p }) => Math.abs(p) < reach)
    .filter(({ i }) => !keep || keep.has(i))
    // paint far cards first so the face-on card always sits on top
    .sort((a, b) => Math.abs(b.p) - Math.abs(a.p));

  return (
    <AbsoluteFill
      style={{
        background,
        // With extra rotation off, each card gets its own perspective (below) so it
        // only twists on its own axis instead of shearing toward a shared vanishing point.
        perspective: flat ? undefined : props.perspective,
        overflow: overscan > 0 ? "visible" : "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: width / 2,
          top: height / 2,
          // Flat mode: each card is its own 3D layer, so cards never depth-clip each other.
          transformStyle: flat ? "flat" : "preserve-3d",
          transform: flat ? undefined : `rotateZ(${sway}deg) rotateY(${lean}deg)`,
        }}
      >
        {visible.map(({ card, i, p }) => {
          const a = Math.abs(p);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                left: -CARD_WIDTH / 2,
                top: -CARD_HEIGHT / 2,
                borderRadius: 28,
                overflow: "hidden",
                backfaceVisibility: "hidden",
                transform: [
                  `translateY(${dir * p * pitch}px)`,
                  flat ? `perspective(${props.perspective}px)` : "",
                  `translateZ(${-a * 160 * extraRotation}px)`,
                  `rotateY(${p * twist}deg)`,
                  `rotateX(${-dir * p * 9 * extraRotation}deg)`,
                  `scale(${cardScale})`,
                ].join(" "),
                boxShadow: props.cardShadow,
                outline: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {card.kind === "screen" ? (
                <Img
                  src={staticFile(card.src)}
                  style={{ width: CARD_WIDTH, height: CARD_HEIGHT, display: "block" }}
                />
              ) : (
                <BrandCard variant={card.variant} />
              )}
              {/* Shade cards as they turn away from camera */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#000",
                  opacity: Math.min(a, 1.4) * 0.38,
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
