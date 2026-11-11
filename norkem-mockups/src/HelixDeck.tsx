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
  /** Degrees of twist between neighbouring cards. */
  twist: number;
  /** Vertical distance between card centres, in px. */
  pitch: number;
  background: string;
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
  const { cards, twist, pitch, background } = props;
  const n = cards.length;
  const scroll = scrollAt(frame, props);

  // Slow sway of the whole column; one full sine period per loop so it stays seamless.
  const phase = (frame / durationInFrames) * Math.PI * 2;
  const sway = Math.sin(phase) * 3;
  const lean = Math.cos(phase) * 4;

  const visible = cards
    .map((card, i) => ({ card, i, p: wrap(i - scroll, n) }))
    .filter(({ p }) => Math.abs(p) < 2.2)
    // paint far cards first so the face-on card always sits on top
    .sort((a, b) => Math.abs(b.p) - Math.abs(a.p));

  return (
    <AbsoluteFill style={{ background, perspective: 2600, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: width / 2,
          top: height / 2,
          transformStyle: "preserve-3d",
          transform: `rotateZ(${sway}deg) rotateY(${lean}deg)`,
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
                  `translateY(${p * pitch}px)`,
                  `translateZ(${-a * 160}px)`,
                  `rotateY(${p * twist}deg)`,
                  `rotateX(${-p * 9}deg)`,
                ].join(" "),
                boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
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
