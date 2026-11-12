import { Composition } from "remotion";
import { DECK_A, DECK_B, DECK_C, DECK_CBTAX } from "./cards";
import { HelixDeck, HelixDeckProps, helixDuration } from "./HelixDeck";
import { OrbitRing, OrbitRingProps, orbitDuration } from "./OrbitRing";
import { GridMarquee, GridMarqueeProps } from "./GridMarquee";
import { Showreel, ShowreelProps, showreelDuration } from "./Showreel";

const FPS = 30;
const WIDTH = 2400;
const HEIGHT = 1200;

const stepped: HelixDeckProps = {
  cards: DECK_A,
  motion: "stepped",
  stepFrames: 48, // 1.6s per card
  holdFrames: 18, // 0.6s face-on
  twist: 62,
  pitch: 790,
  cardScale: 1,
  direction: "up",
  extraRotation: 1,
  perspective: 2600,
  background: "#000000",
  cardShadow: "0 40px 120px rgba(0,0,0,0.45)",
};

const continuous: HelixDeckProps = {
  cards: DECK_B,
  motion: "continuous",
  stepFrames: 54, // 1.8s per card, constant speed
  holdFrames: 0,
  twist: 40,
  pitch: 630, // card is 510px tall at 0.6 scale, leaving a clear gap
  cardScale: 0.6, // 864x510, same 1440:850 ratio
  direction: "down",
  extraRotation: 0, // straight column: twist only, no tilt/sway/curve
  perspective: 4000,
  // Off-white from the Norkem site (#FFF8F8), with a faint warm falloff
  background: "radial-gradient(80% 100% at 50% 50%, #FFFBFA 0%, #F6EFED 100%)",
  cardShadow: "0 24px 70px rgba(42,2,2,0.22), 0 4px 14px rgba(42,2,2,0.12)",
};

const orbit: OrbitRingProps = {
  cards: DECK_C,
  radius: 3070, // wide ring: 12 cards with clear gaps between them
  cameraDistance: 0, // camera at the ring's centre, so cards slide off the sides
  perspective: 1850, // camera pushed in: centre frame ~870px wide
  direction: "left",
  repeat: 3, // the 4 frames repeat 3 times around the ring
  stepFrames: 66, // 2.2s per frame
  damping: 0.7, // swings ~3.5% past centre, then settles back
  stiffness: 8.5,
  drift: 0.03, // slow creep so it never fully stops
  background: continuous.background,
};

// Test showreel: helix (2.8s) -> push-down transition (1.2s) -> orbit (2.8s).
const showreel: ShowreelProps = {
  helix: continuous,
  orbit,
  background: continuous.background,
  sceneFrames: 84, // 2.8s each, including the overlap
  transitionFrames: 36, // 1.2s
  blurSamples: 24, // camera motion blur (enough samples for a smooth streak)
  shutterAngle: 180,
};

// CBTax test: same orbit, three cbtax.com frames, on #1D1D20, at 1920x1080.
const cbtaxOrbit: OrbitRingProps = {
  ...orbit,
  cards: DECK_CBTAX,
  repeat: 4, // 3 frames x 4 keeps the same 12-card ring
  perspective: 1480, // scaled to 1920 wide so frames keep the same proportion of the screen
  background: "#1D1D20",
  cardOutline: "1px solid rgba(255,255,255,0.12)",
};

// CBTax grid: tilted grid of screens, rows sliding in alternating directions.
const cbtaxGrid: GridMarqueeProps = {
  screens: ["40", "39", "41", "49", "42", "47", "531"].map((f) => `grid/frame-${f}.jpg`),
  perRow: 4,
  rows: 7,
  cardScale: 0.6, // 864x480
  gap: 56,
  rotateZ: -28,
  rotateX: 18,
  perspective: 3000,
  background: "#ECECEC",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NorkemHelixStepped"
        component={HelixDeck}
        durationInFrames={helixDuration(stepped)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={stepped}
      />
      <Composition
        id="NorkemHelixContinuous"
        component={HelixDeck}
        durationInFrames={helixDuration(continuous)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={continuous}
      />
      <Composition
        id="NorkemOrbit"
        component={OrbitRing}
        durationInFrames={orbitDuration(orbit)} // 4 frames x 2.2s = 8.8s loop
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={orbit}
      />
      <Composition
        id="NorkemShowreel"
        component={Showreel}
        durationInFrames={showreelDuration(showreel)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={showreel}
      />
      <Composition
        id="CBTaxOrbit"
        component={OrbitRing}
        durationInFrames={orbitDuration(cbtaxOrbit)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={cbtaxOrbit}
      />
      <Composition
        id="CBTaxGrid"
        component={GridMarquee}
        durationInFrames={12 * FPS} // each row travels one full cycle (4 screens) per 12s loop
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={cbtaxGrid}
      />
    </>
  );
};
