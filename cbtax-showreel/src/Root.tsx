import { Composition, Folder } from "remotion";
import { Interactions } from "./scenes/Interactions";
import { Intro } from "./scenes/Intro";
import { Localisation } from "./scenes/Localisation";
import { Mobile } from "./scenes/Mobile";
import { Outro } from "./scenes/Outro";
import { Redesign } from "./scenes/Redesign";
import { Showreel } from "./Showreel";
import { FPS, HEIGHT, SCENES, TOTAL, WIDTH } from "./theme";

const base = { fps: FPS, width: WIDTH, height: HEIGHT };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="CBTaxShowreel" component={Showreel} durationInFrames={TOTAL} {...base} />
    <Folder name="Scenes">
      <Composition id="Intro" component={Intro} durationInFrames={SCENES.intro} {...base} />
      <Composition id="Redesign" component={Redesign} durationInFrames={SCENES.redesign} {...base} />
      <Composition id="Interactions" component={Interactions} durationInFrames={SCENES.interactions} {...base} />
      <Composition id="Mobile" component={Mobile} durationInFrames={SCENES.mobile} {...base} />
      <Composition id="Localisation" component={Localisation} durationInFrames={SCENES.localisation} {...base} />
      <Composition id="Outro" component={Outro} durationInFrames={SCENES.outro} {...base} />
    </Folder>
  </>
);
