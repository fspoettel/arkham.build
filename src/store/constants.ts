export const DATABASE_NAME = "deckbuilder";

export const PARALLEL_INVESTIGATORS: Record<string, string> = {
  "01001": "98004", // Roland
  "01002": "90001", // Daisy
  "01003": "90008", // Skids
  "01004": "90017", // Agnes
  "01005": "90037", // Wendy
  "02001": "90059", // Zoey
  "02004": "90049", // Jim
  "02005": "90046", // Pete
} as const;

export const ACTION_TEXT: { [key: string]: string } = {
  fight: "<b>Fight.</b>",
  engage: "<b>Engage.</b>",
  investigate: "<b>Investigate.</b>",
  play: "<b>Play.</b>",
  draw: "<b>Draw.</b>",
  move: "<b>Move.</b>",
  evade: "<b>Evade.</b>",
  resource: "<b>Resource.</b>",
  parley: "<b>Parley.</b>",
} as const;
