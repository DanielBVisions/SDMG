import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill } from "remotion";
import { Stage } from "./components/Stage";
import { Hero } from "./scenes/Hero";
import { Intro } from "./scenes/Intro";
import { Localisation } from "./scenes/Localisation";
import { Mobile } from "./scenes/Mobile";
import { Outro } from "./scenes/Outro";
import { Scroll } from "./scenes/Scroll";
import { inOut, TRANSITION } from "./theme";
import { zoomBlur } from "./transitions/zoomBlur";

const timing = linearTiming({ durationInFrames: TRANSITION, easing: inOut });

// 20 s, no text. Scene lengths add to 720 frames, minus 5 x 24 frames of overlap = 600.
// The Stage background runs underneath the whole reel so only the devices transition.
export const Showreel: React.FC = () => (
  <AbsoluteFill>
    <Stage />
    <TransitionSeries>
      <TransitionSeries.Sequence name="Intro" durationInFrames={80}>
        <Intro />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={zoomBlur()} timing={timing} />
      <TransitionSeries.Sequence name="Hero" durationInFrames={140}>
        <Hero />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={zoomBlur()} timing={timing} />
      <TransitionSeries.Sequence name="Scroll" durationInFrames={150}>
        <Scroll />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={zoomBlur()} timing={timing} />
      <TransitionSeries.Sequence name="Mobile" durationInFrames={140}>
        <Mobile />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={zoomBlur()} timing={timing} />
      <TransitionSeries.Sequence name="Localisation" durationInFrames={120}>
        <Localisation />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={zoomBlur()} timing={timing} />
      <TransitionSeries.Sequence name="Outro" durationInFrames={90}>
        <Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
