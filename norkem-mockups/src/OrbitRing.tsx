import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { CARD_HEIGHT, CARD_WIDTH, CardDef } from "./cards";

export type OrbitRingProps = {
  cards: CardDef[];
  /** Distance from the ring's centre to each card. */
  radius: number;
  /** Distance from the camera to the ring's centre. */
  cameraDistance: number;
  /** Camera focal length (CSS perspective). */
  perspective: number;
  /** "left" = cards travel right-to-left across the screen. */
  direction: "left" | "right";
  /** How many times the deck repeats around the ring (more cards = wider, gentler orbit). */
  repeat: number;
  /** Frames per card: the turn, the overshoot and the settle at centre. */
  stepFrames: number;
  /** Spring damping ratio (0-1). Lower = bigger overshoot. 0.7 ~= 3.5% past centre. */
  damping: number;
  /** Spring frequency. Higher = arrives and settles sooner within the step. */
  stiffness: number;
  /** Share of each step covered by a constant drift, so the ring never fully stops. */
  drift: number;
  /**
   * Frame the first turn starts on. Before it the ring only drifts slowly (e.g. while a
   * transition brings the scene in), then turns as soon as it has landed.
   */
  startFrame?: number;
  background: string;
};

export const orbitDuration = (p: Pick<OrbitRingProps, "cards" | "stepFrames">) =>
  p.cards.length * p.stepFrames;

// Under-damped spring response from rest: rises smoothly, overshoots, settles back.
const springAt = (t: number, damping: number, stiffness: number) => {
  const wd = stiffness * Math.sqrt(1 - damping * damping);
  return (
    1 -
    Math.exp(-damping * stiffness * t) *
      (Math.cos(wd * t) + ((damping * stiffness) / wd) * Math.sin(wd * t))
  );
};

// 0 -> 1 over a step: spring with a smooth-start time warp (so a turn gathers pace instead
// of kicking off), normalised to land exactly on 1, plus a constant drift. The drift keeps it
// moving through centre and matches the speed where one step hands over to the next.
const stepCurve = (l: number, damping: number, stiffness: number, drift: number) => {
  const tau = l * l * (2 - l);
  const s = springAt(tau, damping, stiffness) / springAt(1, damping, stiffness);
  return (1 - drift) * s + drift * l;
};

// Each step the ring turns one card along, swings slightly past centre, settles back and
// drifts on without ever stopping dead. Over the composition it turns one full deck
// (360 / repeat degrees); because the deck repeats around the ring, every card lands where
// the next one started, so the loop is seamless.
export const OrbitRing: React.FC<OrbitRingProps> = ({
  cards,
  radius,
  cameraDistance,
  perspective,
  direction,
  repeat,
  stepFrames,
  damping,
  stiffness,
  drift,
  startFrame = 0,
  background,
}) => {
  const frame = useCurrentFrame() - startFrame;
  const ring = Array.from({ length: repeat }, () => cards).flat();
  const n = ring.length;
  const dir = direction === "left" ? 1 : -1;
  const step = Math.floor(frame / stepFrames);
  const local = (frame - step * stepFrames) / stepFrames;
  // Before startFrame: a slow lead-in drift that meets the first turn at the same speed.
  const t = frame < 0 ? (drift * frame) / stepFrames : stepCurve(local, damping, stiffness, drift);
  const turn = (step + t) * (360 / n) * dir;

  const placed = ring
    .map((card, i) => {
      const angle = (i * 360) / n + turn;
      const rad = (angle * Math.PI) / 180;
      // Forward distance from camera to the card's centre and to its nearest edge.
      const depth = cameraDistance + radius * Math.cos(rad);
      const nearEdge = depth - (CARD_WIDTH / 2) * Math.abs(Math.sin(rad));
      return { card, i, angle, rad, depth, nearEdge };
    })
    // Cards passing behind the camera are skipped; by then they are off-screen anyway.
    .filter((c) => c.nearEdge > 20)
    // Paint far cards first, near cards on top.
    .sort((a, b) => b.depth - a.depth);

  return (
    <AbsoluteFill style={{ background, perspective, overflow: "hidden" }}>
      {placed.map(({ card, i, angle, rad }) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            marginLeft: -CARD_WIDTH / 2,
            marginTop: -CARD_HEIGHT / 2,
            borderRadius: 24,
            overflow: "hidden",
            backfaceVisibility: "hidden",
            transform: [
              // Move the ring's centre out in front of the camera...
              `translateZ(${perspective - cameraDistance}px)`,
              // ...then place the card on the ring, facing inward.
              `rotateY(${angle}deg)`,
              `translateZ(${-radius}px)`,
            ].join(" "),
            outline: "1px solid rgba(42,2,2,0.08)",
          }}
        >
          {card.kind === "screen" ? (
            <Img
              src={staticFile(card.src)}
              style={{ width: CARD_WIDTH, height: CARD_HEIGHT, display: "block" }}
            />
          ) : null}
          {/* Gentle shading as cards turn side-on */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#2A0202",
              opacity: Math.abs(Math.sin(rad)) * 0.14,
            }}
          />
        </div>
      ))}
    </AbsoluteFill>
  );
};
