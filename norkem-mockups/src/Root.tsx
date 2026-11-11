import { Composition } from "remotion";
import { DECK_A, DECK_B } from "./cards";
import { HelixDeck, HelixDeckProps, helixDuration } from "./HelixDeck";

const FPS = 30;
const WIDTH = 2400;
const HEIGHT = 1200;

const stepped: HelixDeckProps = {
  cards: DECK_A,
  motion: "stepped",
  stepFrames: 48, // 1.6s per card
  holdFrames: 18, // 0.6s face-on
  twist: 62,
  pitch: 790,
  background: "#000000",
};

const continuous: HelixDeckProps = {
  cards: DECK_B,
  motion: "continuous",
  stepFrames: 54, // 1.8s per card, constant speed
  holdFrames: 0,
  twist: 58,
  pitch: 790,
  background: "#000000",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NorkemHelixStepped"
        component={HelixDeck}
        durationInFrames={helixDuration(stepped)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={stepped}
      />
      <Composition
        id="NorkemHelixContinuous"
        component={HelixDeck}
        durationInFrames={helixDuration(continuous)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={continuous}
      />
    </>
  );
};
