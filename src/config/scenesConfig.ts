import { TextStyle } from "pixi.js";

export const ScenesConfig = {
  fragmentStyle: {
    fontFamily: "system-ui",
    fontSize: 20,
    lineHeight: 28,
    wordWrap: true,
    wordWrapWidth: 400,
  },
  uiStyle: {
    fontFamily: "system-ui",
    fontSize: 16,
    fill: "hsl(204 30% 51% / 0.8)",
  },
  buttonStyle: {
    fontFamily: "system-ui",
    fontSize: 24,
    fontWeight: "bold",
    fill: "hsl(204 30% 25%)",
    align: "center",
    letterSpacing: 2,
  }
}

// TODO: this is an alternative way to export the styles & this doesn't cause red squiggles in VSCode, the above does
export const buttonStyle = new TextStyle({
  fontFamily: "system-ui",
  fontSize: 24,
  fontWeight: "bold",
  fill: "hsl(204 30% 25%)",
  align: "center",
  letterSpacing: 2,
});
