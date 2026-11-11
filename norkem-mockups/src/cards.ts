// The deck of cards that travels through the helix.
// Screens are 1440x850 crops of the Norkem Figma frames (public/screens).
// Brand cards are drawn in code (see BrandCard.tsx).

export type CardDef =
  | { kind: "screen"; src: string }
  | { kind: "brand"; variant: "logo" | "tagline" | "mark" | "network" };

export const CARD_WIDTH = 1440;
export const CARD_HEIGHT = 850;

export const BRAND = {
  red: "#971B2F",
  maroon: "#2B0508",
  deep: "#1A0204",
  cream: "#F1ECE7",
  white: "#FFFFFF",
};

// Stepped "deck" order, mixing page screens with graphic brand cards
// the same way the storyboard alternates imagery and type/colour cards.
export const DECK_A: CardDef[] = [
  { kind: "screen", src: "screens/homepage-0.jpg" },
  { kind: "brand", variant: "logo" },
  { kind: "screen", src: "screens/about-2160.jpg" },
  { kind: "screen", src: "screens/industry-details-0.jpg" },
  { kind: "brand", variant: "tagline" },
  { kind: "screen", src: "screens/homepage-1640.jpg" },
  { kind: "screen", src: "screens/product-details-0.jpg" },
  { kind: "brand", variant: "mark" },
  { kind: "screen", src: "screens/location-details-840.jpg" },
  { kind: "screen", src: "screens/homepage-4560.jpg" },
  { kind: "brand", variant: "network" },
  { kind: "screen", src: "screens/homepage-5680.jpg" },
];

// A second, screen-heavy order for the continuous version.
export const DECK_B: CardDef[] = [
  { kind: "screen", src: "screens/homepage-3640.jpg" },
  { kind: "screen", src: "screens/about-0.jpg" },
  { kind: "brand", variant: "mark" },
  { kind: "screen", src: "screens/industry-details-720.jpg" },
  { kind: "screen", src: "screens/location-details-0.jpg" },
  { kind: "brand", variant: "logo" },
  { kind: "screen", src: "screens/all-products-640.jpg" },
  { kind: "screen", src: "screens/product-details-920.jpg" },
  { kind: "brand", variant: "tagline" },
  { kind: "screen", src: "screens/blog-article-0.jpg" },
  { kind: "screen", src: "screens/about-4760.jpg" },
  { kind: "screen", src: "screens/contact-0.jpg" },
];
