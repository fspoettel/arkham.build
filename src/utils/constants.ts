export const REGEX_SKILL_BOOST = /\+\d+?\s\[(.+?)\]/g;

export const REGEX_USES = /^Uses\s\(\d+?\s(\w+?)\)/;

export const REGEX_BONDED = /^Bonded\s\((.*?)\)\./;

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

export type SkillKey =
  | "agility"
  | "combat"
  | "intellect"
  | "willpower"
  | "wild";

export const SKILL_KEYS: SkillKey[] = [
  "agility",
  "combat",
  "intellect",
  "willpower",
  "wild",
] as const;

export const PLAYER_TYPE_ORDER = [
  "investigator",
  "asset",
  "event",
  "skill",
  "location",
  "story",
] as const;

export const ASSET_SLOT_ORDER = [
  "Hand",
  "Hand x2",
  "Accessory",
  "Ally",
  "Arcane",
  "Arcane x2",
  "Body",
  "Tarot",
  // followed by:
  // - multi_slot
  // - permanent
  // - slotless
];

export const SIDEWAYS_TYPE_CODES = ["act", "agenda", "investigator"];

export const CYCLES_WITH_STANDALONE_PACKS = [
  "core",
  "return",
  "investigator",
  "promotional",
  "parallel",
  "side_stories",
];
