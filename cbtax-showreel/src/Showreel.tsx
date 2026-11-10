import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Interactions } from "./scenes/Interactions";
import { Intro } from "./scenes/Intro";
import { Localisation } from "./scenes/Localisation";
import { Mobile } from "./scenes/Mobile";
import { Outro } from "./scenes/Outro";
import { Redesign } from "./scenes/Redesign";
import { TRANSITION } from "./theme";

const timing = linearTiming({ durationInFrames: TRANSITION });

// 20 s total: scene lengths add to 660 frames, minus 5 x 12 frames of transition overlap = 600.
export const Showreel: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Intro" durationInFrames={75}>
      <Intro />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={timing} />
    <TransitionSeries.Sequence name="01 Redesign" durationInFrames={120}>
      <Redesign />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timing} />
    <TransitionSeries.Sequence name="02 Interactions" durationInFrames={120}>
      <Interactions />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timing} />
    <TransitionSeries.Sequence name="03 Mobile" durationInFrames={120}>
      <Mobile />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />
    <TransitionSeries.Sequence name="04 Localisation" durationInFrames={105}>
      <Localisation />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={timing} />
    <TransitionSeries.Sequence name="Outro" durationInFrames={120}>
      <Outro />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
