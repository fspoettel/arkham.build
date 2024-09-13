export type Coded = {
  code: string;
};

export type DeckRequirements = {
  card: Record<string, Record<string, string>>;
  random: { value: string; target: string }[];
  size: number;
};

export type DeckOptionSelectType = "deckSize" | "faction" | "option";

export type OptionSelect = {
  name: string;
  id: string;
  size?: number;
  level: { min: number; max: number };
  trait: string[];
};

export type DeckOption = {
  // => Lola Hayes
  atleast?: {
    min: number;
    factions?: number;
    // not present in dataset, used for special case ancestral knowledge.
    types?: number;
  };
  // => Mandy Thompson
  deck_size_select?: number | number[];
  // => Tony Morgan
  faction_select?: string[];
  // => 5 / 2 deck building
  faction?: string[];
  // => charlie kane's faction_selects
  id?: string;
  // => 5 / 2 deck building
  level?: {
    min: number;
    max: number;
  };
  // => suzie.
  base_level?: {
    min: number;
    max: number;
  };
  // => e.g. Dunwich.
  limit?: number;
  // => Investigators with deck options
  name?: string;
  // => Preston Fairmont
  not?: boolean;
  // => Suzie
  permanent?: boolean;
  // => Wendy (Parallel)
  option_select?: OptionSelect[];
  // => Carolyn / Vincent
  tag?: string[];
  // => Allesandra
  text?: string[];
  // => Silas, Mark
  trait?: string[];
  // => Tony (select), Amanda (static)
  type?: string[];
  // => Akachi
  uses?: string[];
  error?: string;
  // not present in dataset, special case on your own.
  slot?: string[];
  virtual?: boolean;
};

export type CustomizationOption = {
  card?: {
    type: string[];
    trait: string[];
  };
  choice?: "choose_card" | "choose_trait" | "remove_slot" | "choose_skill";
  cost?: number;
  deck_limit?: number;
  health?: number;
  position?: number;
  quantity?: number;
  real_slot?: string;
  real_text?: string;
  real_traits?: string;
  sanity?: number;
  tags?: string[];
  text_change: "append" | "insert" | "replace";
  xp: number;
};

export type QueryCard = {
  alt_art_investigator?: boolean;
  alternate_of_code?: string;
  alternate_required_code?: string;
  back_illustrator?: string;
  back_link_id?: string;
  backimageurl?: string;
  clues?: number;
  clues_fixed?: boolean;
  code: string;
  cost?: number;
  customization_options?: CustomizationOption[];
  deck_limit?: number;
  deck_options?: DeckOption[];
  deck_requirements?: DeckRequirements;
  doom?: number;
  double_sided?: boolean;
  duplicate_of_code?: string;
  encounter_code?: string;
  encounter_position?: number;
  enemy_damage?: number;
  enemy_evade?: number;
  enemy_fight?: number;
  enemy_horror?: number;
  errata_date?: string;
  exceptional?: boolean;
  exile?: boolean;
  faction_code: string;
  faction2_code?: string;
  faction3_code?: string;
  health?: number;
  health_per_investigator?: boolean;
  hidden?: boolean;
  id: string; // {code} or {code}-{taboo_set_id}
  illustrator?: string;
  imageurl?: string;
  is_unique?: boolean;
  linked?: boolean;
  myriad?: boolean;
  official: boolean;
  pack_code: string;
  pack_position: number;
  permanent?: boolean;
  position: number;
  preview?: boolean;
  quantity: number;
  real_back_flavor?: string;
  real_back_name?: string;
  real_back_text?: string;
  real_back_traits?: string;
  real_customization_change?: string;
  real_customization_text?: string;
  real_flavor?: string;
  real_name: string;
  real_slot?: string;
  real_subname?: string;
  real_taboo_text_change?: string;
  real_text?: string;
  real_traits?: string;
  restrictions?: {
    investigator?: Record<string, string>;
    trait?: string[];
  };
  sanity?: number;
  shroud?: number;
  side_deck_options?: DeckOption[];
  side_deck_requirements?: DeckRequirements;
  skill_agility?: number;
  skill_combat?: number;
  skill_intellect?: number;
  skill_willpower?: number;
  skill_wild?: number;
  stage?: number;
  subtype_code?: string;
  taboo_xp?: number;
  taboo_set_id?: number;
  tags?: string[]; // used for some deckbuilding restrictions like `healsHorror`.
  type_code: string;
  vengeance?: number;
  victory?: number;
  xp?: number;
};

export type Card = Omit<QueryCard, "id"> & {
  /* indicates whether a card is part of a parallel investigator pack. */
  parallel?: boolean;
  /* indicates the amount of xp spent on customizations for a card. only relevant in deckbuilder mode. */
  customization_xp?: number;
  /* copy of real slot, can be changed by customizable. */
  original_slot?: string;
};

export type Cycle = {
  code: string;
  real_name: string;
  position: number;
};

export type Faction = {
  code: string;
  name: string;
  is_primary: boolean;
};

export type Pack = {
  code: string;
  real_name: string;
  position: number;
  size?: number;
  cycle_code: string;
  reprint?: {
    type: string; // "player" | "encounter" | "rcore"
  };
};

export type SubType = {
  code: string;
  name: string;
};

export type Type = {
  code: string;
  name: string;
};

export type DataVersion = {
  card_count: number;
  cards_updated_at: string;
  locale: string;
  translation_updated_at: string;
};

type QueryEncounterSet = {
  code: string;
  name: string;
};

export type EncounterSet = QueryEncounterSet & {
  pack_code: string;
};

export type Taboo = {
  code: string;
  real_text?: string;
  real_back_text?: string;
  real_taboo_text_change?: string;
  taboo_xp?: number;
  taboo_set_id: number;
  exceptional?: boolean; // key of ys.
  real_customization_text?: string;
  real_customization_change?: Card["real_customization_change"];
  customization_options?: Card["customization_options"];
  deck_requirements?: Card["deck_requirements"];
  deck_options?: Card["deck_options"];
};

export type TabooSet = {
  id: number;
  name: string;
  card_count: number;
  date: string;
};
