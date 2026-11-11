import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { AbsoluteFill } from "remotion";

type Props = Record<string, never>;

// Zoom-through: the outgoing scene pushes past the camera and blurs away,
// the incoming scene settles in from slightly behind, sharpening as it lands.
const ZoomBlur: React.FC<TransitionPresentationComponentProps<Props>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const entering = presentationDirection === "entering";
  const style: React.CSSProperties = entering
    ? {
        opacity: Math.min(1, p * 1.6),
        scale: String(0.86 + 0.14 * p),
        filter: `blur(${(1 - p) * 22}px)`,
      }
    : {
        opacity: 1 - p,
        scale: String(1 + 0.3 * p),
        filter: `blur(${p * 26}px)`,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const zoomBlur = (): TransitionPresentation<Props> => ({ component: ZoomBlur, props: {} });
