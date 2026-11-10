import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// CBTax uses Urbane (Adobe Fonts). Urbanist is the closest free match.
// Bundled locally (variable font, latin subset) so renders don't depend on Google Fonts.
export const fontFamily = "Urbanist";
loadFont({
  family: fontFamily,
  url: staticFile("fonts/Urbanist-latin.woff2"),
  weight: "100 900",
  format: "woff2",
});

// Colours taken from the live cbtax.com stylesheet.
export const colors = {
  ink: "#1D1D20",
  orange: "#E58A57",
  blue: "#2A64F6",
  lavender: "#C7CCF5",
  peach: "#F4D9CB",
  white: "#FFFFFF",
  grey: "#8E8E8F",
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene lengths in frames. Transitions overlap neighbouring scenes by TRANSITION frames.
export const TRANSITION = 12;
export const SCENES = {
  intro: 75,
  redesign: 120,
  interactions: 120,
  mobile: 120,
  localisation: 105,
  outro: 120,
};
export const TOTAL =
  Object.values(SCENES).reduce((a, b) => a + b, 0) -
  TRANSITION * (Object.keys(SCENES).length - 1);
