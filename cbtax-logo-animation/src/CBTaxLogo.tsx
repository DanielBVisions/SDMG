import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Logo artwork (viewBox 1026 x 271) rendered 1200px wide => scale 1.1696.
// Icon = orange arrowhead (top right). Concept: brand-coloured shapes pop in,
// drift and spin, then fly into place and stretch into the arrowhead segments, which settles
// beside the wordmark as the letters rise into place.

const C_PATH =
  "M107.279 51.4554C139.431 51.4554 164.915 59.8954 170.413 61.7902C173.744 62.9958 174.244 63.5124 174.577 66.2684C175.244 71.2636 174.911 79.7036 173.911 84.6988C173.245 88.144 172.412 88.6606 168.913 87.6269C161.75 85.388 138.431 76.9477 108.112 76.9477C53.808 76.9477 30.6523 101.579 30.6523 155.316C30.6523 209.057 53.808 233.685 108.112 233.685C138.431 233.685 161.75 225.072 168.913 223.005C172.412 221.975 173.245 222.492 173.911 225.933C174.911 230.933 175.244 239.369 174.577 244.364C174.244 247.12 173.744 247.636 170.413 248.842C164.915 250.737 139.431 259.177 107.279 259.177C35.4835 259.177 0 226.454 0 155.316C0 84.1821 35.4835 51.4554 107.279 51.4554Z";
const B_PATH =
  "M260.487 168.985C257.992 168.985 256.994 170.326 256.994 172.673V231.012C256.994 233.191 257.659 234.201 259.821 234.368C266.142 234.872 279.615 235.874 300.74 235.874C335.002 235.874 363.944 234.201 363.944 202.347C363.944 170.661 335.002 168.985 304.067 168.985H260.487ZM355.129 113.999C355.129 82.1456 326.519 81.9779 300.071 81.9779C280.613 81.9779 265.643 82.6485 259.821 83.1518C257.659 83.3194 256.994 84.3252 256.994 86.5045V142.332C256.994 144.512 257.992 146.02 260.487 146.02H300.071C326.519 146.02 355.129 145.682 355.129 113.999ZM227.057 250.459V66.3864C227.057 61.6923 229.382 60.0159 233.707 60.0159H256.994C256.994 60.0159 287.932 58.6783 299.908 58.6783C342.82 58.6783 385.236 63.0372 385.236 110.311C385.236 139.818 367.438 149.705 357.126 152.727C355.961 153.062 355.296 153.393 355.296 154.738V157.085C355.296 158.423 355.961 158.423 357.126 158.762C363.777 160.602 394.879 166.973 394.879 203.856C394.879 248.615 356.96 259.177 302.4 259.177C275.457 259.177 248.011 258.007 233.707 256.83C229.382 256.494 227.057 255.153 227.057 250.459Z";
const T_PATH =
  "M470.605 83.148H408.97C406.537 83.148 405.556 82.4644 405.234 79.7494C404.908 77.2007 404.745 74.1423 404.745 70.9138C404.745 67.6853 404.908 64.6266 405.234 62.0778C405.556 59.3589 406.537 58.6796 408.97 58.6796H568.337C570.777 58.6796 571.755 59.3589 572.077 62.0778C572.403 64.6266 572.566 67.6853 572.566 70.9138C572.566 74.1423 572.403 77.2007 572.077 79.7494C571.755 82.4644 570.777 83.148 568.337 83.148H506.705C504.265 83.148 503.288 84.3335 503.288 86.7125V253.741C503.288 256.799 502.643 257.819 500.04 258.328C497.6 258.838 493.697 259.178 488.657 259.178C483.617 259.178 479.711 258.838 477.274 258.328C474.671 257.819 474.019 256.799 474.019 253.741V86.7125C474.019 84.3335 473.045 83.148 470.605 83.148Z";
const A_PATH =
  "M592.758 179.31C592.758 214.531 605.79 236.674 643.145 236.674C680.333 236.674 693.54 214.531 693.54 179.31C693.54 144.094 680.333 121.775 643.145 121.775C605.79 121.775 592.758 144.094 592.758 179.31ZM716.645 256.896C713.695 257.419 710.742 257.597 707.092 257.597C703.442 257.597 700.143 257.419 696.839 256.896C693.886 256.377 693.189 256.028 692.496 253.06L690.756 245.567C690.236 243.474 689.716 243.126 688.15 243.126H686.937C685.197 243.126 684.85 243.3 683.807 244.172C679.637 247.659 667.821 259.512 637.932 259.512C596.754 259.512 562.696 238.243 562.696 179.31C562.696 120.381 596.754 99.1124 637.932 99.1124C667.821 99.1124 679.637 110.965 683.807 114.452C684.85 115.324 685.197 115.498 686.937 115.498H688.15C689.716 115.498 690.583 115.15 690.756 113.755L692.323 105.211C692.843 102.421 693.713 101.728 696.666 101.379C699.619 101.027 702.922 100.852 706.572 100.852C710.215 100.852 713.869 101.027 716.645 101.379C720.298 101.898 720.645 103.293 720.645 106.258V252.018C720.645 255.505 720.298 256.203 716.645 256.896Z";
const X_PATH =
  "M815.934 176.366C815.934 175.831 815.764 175.474 815.431 174.939L766.448 105.536C765.782 104.644 765.449 103.752 765.449 103.038C765.449 101.785 766.448 100.719 768.78 100.183C771.948 99.4653 777.279 99.1124 782.607 99.1124C786.94 99.1124 791.272 99.291 793.941 99.8264C797.109 100.54 797.941 100.897 799.605 103.573L838.592 161.383C839.594 162.806 839.927 162.806 841.594 162.806H842.259C843.927 162.806 844.259 162.806 845.258 161.383L884.248 103.395C886.075 100.719 886.747 100.183 889.909 99.6478C892.744 99.291 896.907 99.1124 901.073 99.1124C906.238 99.1124 911.236 99.291 914.404 100.005C916.737 100.54 917.735 101.432 917.735 102.859C917.735 103.573 917.402 104.465 916.737 105.357L867.753 174.939C867.42 175.474 867.254 175.831 867.254 176.366C867.254 176.723 867.42 177.262 867.753 177.794L919.568 253.267C920.234 254.155 920.567 255.051 920.567 255.939C920.567 257.192 919.568 258.259 917.402 258.616C914.068 259.151 908.737 259.512 903.409 259.512C899.073 259.512 894.74 259.329 891.912 258.972C888.747 258.437 887.909 257.727 886.245 255.229L844.592 190.997C843.927 189.926 843.258 189.569 841.594 189.569H840.925C839.261 189.569 838.592 189.926 837.76 190.997L795.941 255.229C794.104 257.902 793.439 258.437 790.108 258.972C787.442 259.329 783.279 259.512 778.947 259.512C773.948 259.512 768.95 259.329 765.616 258.616C763.449 258.259 762.618 257.192 762.618 255.761C762.618 255.051 762.95 254.155 763.449 253.267L815.431 177.794C815.764 177.262 815.934 176.723 815.934 176.366Z";
const ICON_PATH =
  "M992.424 37.7447C992.122 37.3907 991.807 37.2644 991.287 37.1264L919.461 23.0254C918.511 22.8691 917.787 22.493 917.385 22.0238C916.674 21.2046 916.733 19.853 917.974 17.995C919.669 15.4853 923.007 11.8101 926.539 8.36956C929.412 5.57693 932.386 2.90341 934.459 1.53314C936.965 -0.0381954 937.721 -0.343526 940.341 0.34533L998.964 13.2586C999.172 13.3033 999.588 13.4262 1000.14 13.6086C1007.51 16.0252 1013.05 22.56 1014.7 30.5619C1014.98 31.962 1015.18 32.9971 1015.19 33.2987L1023.85 102.564C1024.15 105.509 1024.02 106.291 1022.11 108.794C1020.54 110.745 1017.88 113.552 1015.01 116.345C1011.69 119.573 1008.27 122.679 1005.66 124.358C1004.02 125.52 1002.86 125.352 1002.05 124.414C1001.65 123.941 1001.36 123.14 1001.19 122.228L992.899 39.0071C992.819 38.441 992.628 37.9755 992.424 37.7447Z";

const INK = "#1D1D20";
const ORANGE = "#E58A57";

const CONVERGE_START = 52;
const CONVERGE_END = 80;
const SPREAD = 0.95; // scatter distance multiplier
const SIZE = 0.8; // shape size multiplier

// Icon geometry while it forms in the centre of the frame.
// Icon units (logo viewBox) -> screen px at the 2.4x "stage" scale.
const STAGE_SCALE = 2.4;
const K = (1200 / 1026) * STAGE_SCALE;
const ICON_CX = 970.45;
const ICON_CY = 62.6;
const toScreen = (ux: number, uy: number) => ({
  x: (ux - ICON_CX) * K,
  y: (uy - ICON_CY) * K,
});
// Arm centrelines (icon units): top arm runs into the corner, side arm runs down from it
const TOP_ARM = { from: [912, 10], to: [1004, 25] };
const SIDE_ARM = { from: [1004, 25], to: [1014, 132] };
const ARM_THICKNESS = 24; // icon units
const LANDED_THICKNESS = 40; // pieces overfill the arm, the clip trims them

type Slot = {
  x: number;
  y: number;
  angle: number;
  length: number;
  round?: boolean;
};

const slotsAlong = (
  arm: { from: number[]; to: number[] },
  count: number,
): Slot[] => {
  const [x1, y1] = arm.from;
  const [x2, y2] = arm.to;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const seg = len / count;
  return new Array(count).fill(0).map((_, i) => {
    const t = (i + 0.5) / count;
    const p = toScreen(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
    return { x: p.x, y: p.y, angle, length: (seg + ARM_THICKNESS * 0.55) * K };
  });
};

// 5 segments build the top arm, 6 the side arm, 1 caps the corner
const SLOTS: Slot[] = [
  ...slotsAlong(TOP_ARM, 5),
  ...slotsAlong(SIDE_ARM, 6),
  { ...toScreen(1004, 22), angle: 45, length: 40 * K, round: true },
];

type Shape = {
  x: number;
  y: number;
  size: number;
  color: string;
  radius: number[]; // corner radii as fraction of size
  delay: number;
  spin: number;
  rot0: number;
  orbit: number;
  orbitSpeed: number;
  convergeDelay: number;
};

const PEACH = "#F2B48F";
const PALE = "#F7D9C6";
const GREY = "#B9B8B4";

const CIRCLE = [0.5, 0.5, 0.5, 0.5];
const SQUARE = [0.22, 0.22, 0.22, 0.22];
const PETAL = [0.5, 0.5, 0.5, 0.08];

// Order matches SLOTS (5 top arm, 6 side arm, 1 corner)
const SHAPES: Shape[] = [
  { x: -380, y: -150, size: 44, color: PEACH, radius: CIRCLE, delay: 12, spin: 0, rot0: 0, orbit: 16, orbitSpeed: 2.2, convergeDelay: 0 },
  { x: -230, y: -40, size: 70, color: INK, radius: SQUARE, delay: 6, spin: 2.2, rot0: 20, orbit: 22, orbitSpeed: 1.6, convergeDelay: 2 },
  { x: -130, y: -200, size: 58, color: GREY, radius: SQUARE, delay: 11, spin: 1.9, rot0: 35, orbit: 18, orbitSpeed: 1.3, convergeDelay: 3 },
  { x: 180, y: -150, size: 62, color: PEACH, radius: CIRCLE, delay: 8, spin: 0, rot0: 0, orbit: 18, orbitSpeed: 1.9, convergeDelay: 5 },
  { x: 260, y: -250, size: 26, color: ORANGE, radius: CIRCLE, delay: 16, spin: 0, rot0: 0, orbit: 12, orbitSpeed: 2.6, convergeDelay: 6 },
  { x: 0, y: 0, size: 90, color: ORANGE, radius: CIRCLE, delay: 2, spin: 0, rot0: 0, orbit: 10, orbitSpeed: 1.2, convergeDelay: 6 },
  { x: 330, y: 20, size: 84, color: ORANGE, radius: PETAL, delay: 10, spin: -1.6, rot0: 40, orbit: 26, orbitSpeed: 1.1, convergeDelay: 4 },
  { x: 120, y: 170, size: 54, color: INK, radius: CIRCLE, delay: 7, spin: 0, rot0: 0, orbit: 20, orbitSpeed: 1.7, convergeDelay: 3 },
  { x: -90, y: 150, size: 46, color: ORANGE, radius: SQUARE, delay: 14, spin: -2.6, rot0: 10, orbit: 14, orbitSpeed: 2.0, convergeDelay: 2 },
  { x: 430, y: 200, size: 36, color: INK, radius: CIRCLE, delay: 15, spin: 0, rot0: 0, orbit: 14, orbitSpeed: 2.3, convergeDelay: 1 },
  { x: -330, y: 140, size: 80, color: PALE, radius: PETAL, delay: 9, spin: 1.4, rot0: -30, orbit: 20, orbitSpeed: 1.4, convergeDelay: 0 },
  { x: -470, y: 30, size: 32, color: ORANGE, radius: CIRCLE, delay: 13, spin: 0, rot0: 0, orbit: 12, orbitSpeed: 2.1, convergeDelay: 8 },
];

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const piece = (sh: Shape, i: number, frame: number, fps: number) => {
  const slot = SLOTS[i];
  const pop = spring({
    frame: frame - sh.delay,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.6 },
  });
  // Gentle orbit while floating
  const t = frame / fps;
  const ox = Math.cos(t * sh.orbitSpeed + i) * sh.orbit;
  const oy = Math.sin(t * sh.orbitSpeed * 1.3 + i) * sh.orbit;
  // Travel into the slot
  const c = interpolate(
    frame,
    [CONVERGE_START + sh.convergeDelay, CONVERGE_END + sh.convergeDelay - 8],
    [0, 1],
    { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) },
  );
  // Morph (shape, colour, size) slightly after travel starts
  const m = interpolate(
    frame,
    [CONVERGE_START + sh.convergeDelay + 6, CONVERGE_END + sh.convergeDelay],
    [0, 1],
    { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) },
  );
  const spread = interpolate(pop, [0, 1], [0.15, 1]);
  const fx = sh.x * SPREAD * spread + ox;
  const fy = sh.y * SPREAD * spread + oy;
  const x = fx + (slot.x - fx) * c;
  const y = fy + (slot.y - fy) * c;

  // Rotate to the arm's angle by the shortest route
  const freeRot = sh.rot0 + frame * sh.spin;
  const target = slot.angle + 180 * Math.round((freeRot - slot.angle) / 180);
  const rot = freeRot + (target - freeRot) * c;

  const size = sh.size * SIZE;
  const w = size + (slot.length - size) * m;
  const h = size + (LANDED_THICKNESS * K - size) * m;
  const finalRadius = (slot.round ? 0.5 : 0.1) * LANDED_THICKNESS * K;
  const radius = sh.radius
    .map((r) => `${r * size + (finalRadius - r * size) * m}px`)
    .join(" ");

  return {
    clip: interpolate(m, [0.25, 0.85], [0, 1], clamp),
    style: {
      position: "absolute",
      left: 960 - w / 2,
      top: 540 - h / 2,
      width: w,
      height: h,
      backgroundColor: interpolateColors(m, [0, 1], [sh.color, ORANGE]),
      borderRadius: radius,
      translate: `${x}px ${y}px`,
      rotate: `${rot}deg`,
      scale: String(pop),
    } as React.CSSProperties,
  };
};

export const CBTaxLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill name="Background" style={{ backgroundColor: "#F6F5F1" }}>
      {/* Scattered brand shapes: pop in, drift and spin, then fly into
          slots along the arrowhead and stretch into its segments */}
      {/* Clip = the exact logo mark, in screen space while it forms in the centre */}
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <clipPath id="mark-clip" clipPathUnits="userSpaceOnUse">
            <path
              d={ICON_PATH}
              transform={`translate(960 540) scale(${K}) translate(${-ICON_CX} ${-ICON_CY})`}
            />
          </clipPath>
        </defs>
      </svg>

      {/* Free shapes (unclipped) fade out as they land... */}
      <AbsoluteFill name="Shapes">
        {SHAPES.map((sh, i) => {
          const p = piece(sh, i, frame, fps);
          return <div key={i} style={{ ...p.style, opacity: 1 - p.clip }} />;
        })}
      </AbsoluteFill>
      {/* ...while the same shapes, trimmed to the real mark outline, fade in.
          Once all have landed they fill the mark exactly. */}
      <AbsoluteFill
        name="Shapes in mark"
        style={{
          clipPath: "url(#mark-clip)",
          opacity: interpolate(frame, [95, 96], [1, 0], clamp),
        }}
      >
        {SHAPES.map((sh, i) => {
          const p = piece(sh, i, frame, fps);
          return <div key={i} style={{ ...p.style, opacity: p.clip }} />;
        })}
      </AbsoluteFill>

      {/* Logo lockup, 1200px wide, centred */}
      <AbsoluteFill
        name="Lockup"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Interactive.Div
          name="Logo"
          style={{
            position: "relative",
            width: 1200,
            height: 317,
            scale: interpolate(frame, [96, 200], [1, 1.03], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          {/* Wordmark: letters rise from the baseline, staggered */}
          <svg
            width={1200}
            height={317}
            viewBox="0 0 1026 271"
            style={{ position: "absolute", inset: 0 }}
          >
            <defs>
              <clipPath id="wordmark-clip">
                <rect x={-10} y={40} width={940} height={225} />
              </clipPath>
            </defs>
            <g clipPath="url(#wordmark-clip)" fill={INK}>
              {[C_PATH, B_PATH, T_PATH, A_PATH, X_PATH].map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fillRule="evenodd"
                  style={{
                    translate: interpolate(
                      frame,
                      [122 + i * 5, 148 + i * 5],
                      ["0px 230px", "0px 0px"],
                      { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) },
                    ),
                  }}
                />
              ))}
            </g>
          </svg>

          {/* Arrowhead icon: forms on the trajectory, then settles into place */}
          <Interactive.Div
            name="Icon"
            style={{
              position: "absolute",
              left: 1071.3,
              top: 0,
              width: 125.2,
              height: 146.4,
              translate: interpolate(
                frame,
                [110, 136],
                ["-533.9px 85.3px", "0px 0px"],
                { ...clamp, easing: Easing.bezier(0.7, 0, 0.2, 1) },
              ),
              scale: interpolate(frame, [98, 103, 108, 110, 136], [2.4, 2.52, 2.4, 2.4, 1], {
                ...clamp,
                easing: [
                  Easing.bezier(0.16, 1, 0.3, 1),
                  Easing.bezier(0.45, 0, 0.55, 1),
                  Easing.linear,
                  Easing.bezier(0.7, 0, 0.2, 1),
                ],
              }),
              opacity: interpolate(frame, [95, 96], [0, 1], clamp),
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="916.9 0 107.1 125.2"
              style={{ overflow: "visible" }}
            >
              <path
                d={ICON_PATH}
                fill={ORANGE}
                fillRule="evenodd"
               
              />
            </svg>
          </Interactive.Div>
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
