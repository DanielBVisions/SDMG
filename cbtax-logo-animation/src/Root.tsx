import { Composition } from "remotion";
import { CBTaxLogo } from "./CBTaxLogo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CBTaxLogo"
      component={CBTaxLogo}
      durationInFrames={200}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
