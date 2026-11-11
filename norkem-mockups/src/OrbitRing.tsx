import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
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
  background: string;
};

// The ring turns by one full deck (360 / repeat degrees) over the composition. Because the
// deck repeats around the ring, that lands every card exactly where the next one started,
// so the loop is seamless.
export const OrbitRing: React.FC<OrbitRingProps> = ({
  cards,
  radius,
  cameraDistance,
  perspective,
  direction,
  repeat,
  background,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const ring = Array.from({ length: repeat }, () => cards).flat();
  const n = ring.length;
  const dir = direction === "left" ? 1 : -1;
  const turn = (frame / durationInFrames) * (360 / repeat) * dir;

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
