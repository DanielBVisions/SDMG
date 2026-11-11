import { AbsoluteFill, Easing } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { HelixDeck, HelixDeckProps } from "./HelixDeck";
import { OrbitRing, OrbitRingProps } from "./OrbitRing";

export type ShowreelProps = {
  helix: HelixDeckProps;
  orbit: OrbitRingProps;
  /** Shared backdrop behind both scenes, so the transition has no seam. */
  background: string;
  sceneFrames: number;
  transitionFrames: number;
};

export const showreelDuration = (p: Pick<ShowreelProps, "sceneFrames" | "transitionFrames">) =>
  p.sceneFrames * 2 - p.transitionFrames;

export const Showreel: React.FC<ShowreelProps> = ({
  helix,
  orbit,
  background,
  sceneFrames,
  transitionFrames,
}) => {
  return (
    <AbsoluteFill style={{ background }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={sceneFrames}>
          <HelixDeck {...helix} background="transparent" />
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
          <OrbitRing {...orbit} background="transparent" />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
