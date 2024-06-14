import { SchemaType } from "../utils";

export const cycleSchema = {
  code: { type: "string" },
  name: { type: "string" },
  position: { type: "number" },
  size: { type: "number" },
} as const;

export const factionsSchema = {
  code: { type: "string" },
  name: { type: "string" },
  is_primary: { type: "boolean" },
  octgn_id: { type: "string" },
} as const;

export const packsSchema = {
  code: { type: "string" },
  cycle_code: { type: "string" },
  official: { type: "boolean" },
  position: { type: "number" },
  real_name: { type: "string" },
} as const;

export const subTypesSchema = {
  code: { type: "string" },
  name: { type: "string" },
} as const;

export const typesSchema = {
  code: { type: "string" },
  name: { type: "string" },
} as const;

export const allCardUpdatedSchema = {
  card_count: { type: "number" },
  cards_updated_at: { type: "string" },
  locale: { type: "string" },
  translation_updated_at: { type: "string" },
} as const;

export const cardSchema = {
  alt_art_investigator: { type: "boolean", default: false },
  alternate_of_code: { type: "string" },
  alternate_required_code: { type: "string" },
  back_illustrator: { type: "string" },
  back_link_id: { type: "string" },
  backimagesrc: { type: "string" },
  backimageurl: { type: "string" },
  clues: { type: "number" },
  clues_fixed: { type: "boolean" },
  code: { type: "string" },
  cost: { type: "number" },
  customization_options: { type: "string" },
  deck_limit: { type: "number" },
  deck_options: { type: "string" },
  deck_requirements: { type: "string" },
  doom: { type: "number" },
  double_sided: { type: "boolean" },
  duplicate_of_code: { type: "string" },
  encounter_code: { type: "string" },
  encounter_position: { type: "number" },
  enemy_damage: { type: "number" },
  enemy_evade: { type: "number" },
  enemy_fight: { type: "number" },
  enemy_horror: { type: "number" },
  errata_date: { type: "string" },
  exceptional: { type: "boolean" },
  exile: { type: "boolean" },
  faction_code: { type: "string" },
  faction2_code: { type: "string" },
  faction3_code: { type: "string" },
  heals_damage: { type: "boolean" },
  heals_horror: { type: "boolean" },
  health: { type: "number" },
  hidden: { type: "boolean" },
  id: { type: "string" },
  illustrator: { type: "string" },
  imagesrc: { type: "string" },
  imageurl: { type: "string" },
  is_unique: { type: "boolean" },
  linked: { type: "boolean" },
  linked_card_code: { type: "string" },
  myriad: { type: "boolean" },
  official: { type: "boolean" },
  pack_code: { type: "string" },
  pack_position: { type: "string" },
  permanent: { type: "string" },
  position: { type: "number" },
  preview: { type: "boolean" },
  quantity: { type: "number" },
  real_back_flavor: { type: "string" },
  real_back_name: { type: "string" },
  real_back_text: { type: "string" },
  real_back_traits: { type: "string" },
  real_customization_change: { type: "string" },
  real_customization_text: { type: "string" },
  // real_encounter_set_name
  // real_pack_name
  real_flavor: { type: "string" },
  real_name: { type: "string" },
  real_slot: { type: "string" },
  real_subname: { type: "string" },
  // real_taboo_original_back_text: { type: "string" },
  // real_taboo_original_text: { type: "string" },
  // real_taboo_text_change: { type: "string" },
  real_text: { type: "string" },
  real_traits: { type: "string" },
  restrictions: { type: "string" },
  sanity: { type: "number" },
  shroud: { type: "number" },
  side_deck_options: { type: "string" },
  side_deck_requirements: { type: "string" },
  skill_agility: { type: "number" },
  skill_combat: { type: "number" },
  skill_intellect: { type: "number" },
  skill_willpower: { type: "number" },
  spoiler: { type: "boolean" },
  stage: { type: "number" },
  subtype_code: { type: "string" },
  // taboo_placeholder: { type: "boolean" },
  // taboo_set_id: { type: "string" },
  tags: { type: "string" },
  type_code: { type: "string" },
  updated_at: { type: "string" },
  vengeance: { type: "number" },
  version: { type: "number" },
  victory: { type: "number" },
  xp: { type: "number" },
} as const;

export type Card = SchemaType<typeof cardSchema>;
export type Cycle = SchemaType<typeof cycleSchema>;
export type Faction = SchemaType<typeof cycleSchema>;
export type Pack = SchemaType<typeof cycleSchema>;
export type SubType = SchemaType<typeof subTypesSchema>;
export type Type = SchemaType<typeof typesSchema>;
export type AllCardUpdated = SchemaType<typeof allCardUpdatedSchema>;

export const tableSchema = {
  cards: cardSchema,
  cycles: cycleSchema,
  factions: factionsSchema,
  packs: packsSchema,
  subTypes: subTypesSchema,
  types: typesSchema,
} as const;

export const valuesSchema = {
  ...allCardUpdatedSchema,
} as const;
