import { AbsoluteFill, Easing } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { HelixDeck, HelixDeckProps } from "./HelixDeck";
import { OrbitRing, OrbitRingProps } from "./OrbitRing";

export type ShowreelProps = {
  helix: HelixDeckProps;
  orbit: OrbitRingProps;
  /** Shared backdrop behind both scenes, so the transition has no seam. */
  background: string;
  sceneFrames: number;
  transitionFrames: number;
  /** Sub-frame samples blended per frame (0 = no motion blur). More = smoother, slower render. */
  blurSamples: number;
  /** Shutter angle in degrees: 180 = natural film blur, 360 = maximum. */
  shutterAngle: number;
};

export const showreelDuration = (
  p: Pick<ShowreelProps, "sceneFrames" | "transitionFrames">,
) => p.sceneFrames * 2 - p.transitionFrames;

export const Showreel: React.FC<ShowreelProps> = ({
  helix,
  orbit,
  background,
  sceneFrames,
  transitionFrames,
  blurSamples,
  shutterAngle,
}) => {
  const scenes = (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={sceneFrames}>
        {/* As the transition starts, the column ends: the cards on screen are drawn whole
              (overscan) and slide out, and no new cards follow them in, so nothing is
              clipped and nothing overlaps the incoming orbit. */}
        <HelixDeck
          {...helix}
          background="transparent"
          overscan={1200}
          endColumnAtFrame={sceneFrames - transitionFrames}
        />
      </TransitionSeries.Sequence>
      {/* Push downward: the helix is already travelling down, so it carries on out of
            frame and the orbit follows in from the top. */}
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-top" })}
        timing={linearTiming({
          durationInFrames: transitionFrames,
          easing: Easing.bezier(0.65, 0, 0.35, 1),
        })}
      />
      <TransitionSeries.Sequence durationInFrames={sceneFrames}>
        {/* Drifts in during the transition, then turns as soon as it lands; one full turn
              fits in the rest of the scene. */}
        <OrbitRing
          {...orbit}
          background="transparent"
          startFrame={transitionFrames}
          stepFrames={sceneFrames - transitionFrames}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );

  // The backdrop stays outside the blur, so only the moving frames smear.
  return (
    <AbsoluteFill style={{ background }}>
      {blurSamples > 0 ? (
        <CameraMotionBlur samples={blurSamples} shutterAngle={shutterAngle}>
          {scenes}
        </CameraMotionBlur>
      ) : (
        scenes
      )}
    </AbsoluteFill>
  );
};
