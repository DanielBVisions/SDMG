import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

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
  lavender: "#C7CCF5",
  peach: "#F4D9CB",
  white: "#FFFFFF",
};

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Shared easing: fast start, long soft settle (Apple-style).
export const smooth = Easing.bezier(0.16, 1, 0.3, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Scene lengths in frames. Neighbouring scenes overlap by TRANSITION frames.
export const TRANSITION = 24;
export const SCENES = {
  intro: 80,
  hero: 140,
  scroll: 150,
  mobile: 140,
  localisation: 120,
  outro: 90,
};

const order = Object.values(SCENES);
// Global frame where each scene starts, e.g. START[2] is the scroll scene.
export const START = order.map((_, i) => order.slice(0, i).reduce((a, b) => a + b - TRANSITION, 0));
export const TOTAL = order.reduce((a, b) => a + b, 0) - TRANSITION * (order.length - 1);
