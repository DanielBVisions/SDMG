import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../theme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

// "01 / Feature title / one-line detail" caption used by every feature scene.
export const FeatureCaption: React.FC<{
  index: string;
  title: React.ReactNode;
  detail: string;
  dark?: boolean;
  style?: React.CSSProperties;
}> = ({ index, title, detail, dark, style }) => {
  const frame = useCurrentFrame();
  const ink = dark ? colors.white : colors.ink;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, ...style }}>
      <Interactive.Div
        name="Index"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 4,
          color: colors.orange,
          opacity: interpolate(frame, [6, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }),
          translate: interpolate(frame, [6, 24], ["0px 20px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }),
        }}
      >
        <div
          style={{
            height: 4,
            backgroundColor: colors.orange,
            borderRadius: 2,
            width: interpolate(frame, [6, 26], [0, 56], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }),
          }}
        />
        {index}
      </Interactive.Div>
      <Interactive.Div
        name="Title"
        style={{
          fontSize: 84,
          lineHeight: 1.0,
          fontWeight: 800,
          letterSpacing: -2,
          color: ink,
          opacity: interpolate(frame, [10, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }),
          translate: interpolate(frame, [10, 32], ["0px 40px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }),
        }}
      >
        {title}
      </Interactive.Div>
      <Interactive.Div
        name="Detail"
        style={{
          fontSize: 34,
          lineHeight: 1.3,
          fontWeight: 500,
          color: dark ? "rgba(255,255,255,0.7)" : "#55555A",
          maxWidth: 560,
          opacity: interpolate(frame, [18, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }),
          translate: interpolate(frame, [18, 38], ["0px 30px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }),
        }}
      >
        {detail}
      </Interactive.Div>
    </div>
  );
};

export const Accent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: colors.orange }}>{children}</span>
);
