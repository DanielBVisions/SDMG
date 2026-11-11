import { Img, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { BRAND, CARD_HEIGHT, CARD_WIDTH, CardDef } from "./cards";

// Bundled locally so renders never depend on a network font fetch.
const fontFamily = "Inter";
loadFont({ family: fontFamily, url: staticFile("fonts/inter-400.woff2"), weight: "400" });
loadFont({ family: fontFamily, url: staticFile("fonts/inter-500.woff2"), weight: "500" });

type Variant = Extract<CardDef, { kind: "brand" }>["variant"];

const base: React.CSSProperties = {
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  position: "relative",
  overflow: "hidden",
  fontFamily,
};

export const BrandCard: React.FC<{ variant: Variant }> = ({ variant }) => {
  if (variant === "logo") {
    return (
      <div
        style={{
          ...base,
          background: BRAND.red,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img src={staticFile("brand/logo-white.svg")} style={{ width: 860 }} />
      </div>
    );
  }

  if (variant === "mark") {
    return (
      <div
        style={{
          ...base,
          background: BRAND.cream,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img src={staticFile("brand/mark.svg")} style={{ height: 560 }} />
      </div>
    );
  }

  if (variant === "tagline") {
    return (
      <div
        style={{
          ...base,
          background: BRAND.maroon,
          color: BRAND.white,
          padding: "110px 120px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 132,
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            fontWeight: 400,
          }}
        >
          Global chemical
          <br />
          supply, delivered
          <br />
          <span style={{ color: "#E2606F" }}>with confidence.</span>
        </div>
        <Img
          src={staticFile("brand/logo-white.svg")}
          style={{ width: 300, alignSelf: "flex-end" }}
        />
      </div>
    );
  }

  // network
  return (
    <div
      style={{
        ...base,
        background: `radial-gradient(120% 90% at 50% 120%, ${BRAND.red} 0%, ${BRAND.maroon} 55%, ${BRAND.deep} 100%)`,
        color: BRAND.white,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 48,
      }}
    >
      <div
        style={{
          fontSize: 120,
          lineHeight: 1.04,
          letterSpacing: "-0.035em",
        }}
      >
        A global network,
        <br />a local presence
      </div>
      <div
        style={{
          fontSize: 34,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          opacity: 0.7,
          fontWeight: 500,
        }}
      >
        UK · Australia · China · Netherlands · Spain
      </div>
    </div>
  );
};
