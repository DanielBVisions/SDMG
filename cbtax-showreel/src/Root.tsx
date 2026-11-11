import { Composition, Folder } from "remotion";
import { Hero } from "./scenes/Hero";
import { Intro } from "./scenes/Intro";
import { Localisation } from "./scenes/Localisation";
import { Mobile } from "./scenes/Mobile";
import { Outro } from "./scenes/Outro";
import { Scroll } from "./scenes/Scroll";
import { Showreel } from "./Showreel";
import { FPS, HEIGHT, SCENES, TOTAL, WIDTH } from "./theme";

const base = { fps: FPS, width: WIDTH, height: HEIGHT };

// Scenes are transparent; the shared Stage background is added in Showreel.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="CBTaxShowreel" component={Showreel} durationInFrames={TOTAL} {...base} />
    <Folder name="Scenes">
      <Composition id="Intro" component={Intro} durationInFrames={SCENES.intro} {...base} />
      <Composition id="Hero" component={Hero} durationInFrames={SCENES.hero} {...base} />
      <Composition id="Scroll" component={Scroll} durationInFrames={SCENES.scroll} {...base} />
      <Composition id="Mobile" component={Mobile} durationInFrames={SCENES.mobile} {...base} />
      <Composition id="Localisation" component={Localisation} durationInFrames={SCENES.localisation} {...base} />
      <Composition id="Outro" component={Outro} durationInFrames={SCENES.outro} {...base} />
    </Folder>
  </>
);
