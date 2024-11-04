import { type AttachableDefinition, FACTION_ORDER } from "@/utils/constants";
import type {
  Card,
  Cycle,
  EncounterSet,
  OptionSelect,
  Pack,
  SubType,
  TabooSet,
  Type,
} from "../services/queries.types";
import type { Deck } from "../slices/data.types";
import type { AttachmentQuantities } from "../slices/deck-edits.types";
import type { Groupings } from "./deck-grouping";

export type SealedDeck = {
  name: string;
  cards: Record<string, number>;
};

export type ResolvedCard = {
  card: Card;
  back?: ResolvedCard;
  encounterSet?: EncounterSet;
  cycle: Cycle;
  pack: Pack;
  subtype?: SubType;
  type: Type;
};

export type CardWithRelations = ResolvedCard & {
  relations?: {
    bound?: ResolvedCard[];
    bonded?: ResolvedCard[];

    restrictedTo?: ResolvedCard;
    parallel?: ResolvedCard;
    base?: ResolvedCard;

    advanced?: ResolvedCard[];
    replacement?: ResolvedCard[];
    requiredCards?: ResolvedCard[];
    parallelCards?: ResolvedCard[];
    duplicates?: ResolvedCard[];

    level?: ResolvedCard[];
  };
};

export function isCardWithRelations(
  x: ResolvedCard | CardWithRelations,
): x is CardWithRelations {
  return "relations" in x;
}

export type Customization = {
  index: number;
  xp_spent: number;
  selections?: string;
};

export type Customizations = Record<
  string,
  Record<number | string, Customization>
>;

export type DeckMeta = {
  alternate_back?: string | null;
  alternate_front?: string | null;
  card_pool?: string | null;
  deck_size_selected?: string | null;
  extra_deck?: string | null;
  faction_1?: string | null;
  faction_2?: string | null;
  faction_selected?: string | null;
  option_selected?: string | null;
  sealed_deck_name?: string | null;
  sealed_deck?: string | null;
  transform_into?: string | null;
} & {
  [key in `cus_${string}`]: string | null;
} & {
  [key in `attachments_${string}`]: string | null;
};

type DeckSizeSelection = {
  type: "deckSize";
  value: number;
  options: number[];
  name: string;
  accessor: string;
};

type FactionSelection = {
  type: "faction";
  value?: string;
  options: string[];
  name: string;
  accessor: string;
};

type OptionSelection = {
  type: "option";
  value?: OptionSelect;
  options: OptionSelect[];
  name: string;
  accessor: string;
};

export function isOptionSelect(x: unknown): x is OptionSelect {
  return typeof x === "object" && x != null && "id" in x;
}

export type Selection = OptionSelection | FactionSelection | DeckSizeSelection;

// selections, keyed by their `id`, or if not present their `name`.
export type Selections = Record<string, Selection>;

export const SKILL_ICONS = [
  "skill_agility",
  "skill_combat",
  "skill_intellect",
  "skill_willpower",
  "skill_wild",
] as const;
export const FACTION_NAME = FACTION_ORDER.filter(
  (entry) => !(entry === "multiclass" || entry === "mythos"),
);
export type SkillIcon = (typeof SKILL_ICONS)[number];
export type FactionName = (typeof FACTION_NAME)[number];

export type DecksChartInfo = {
  costCurve: ChartableData;
  skillIcons: ChartableData<SkillIcon>;
  factions: ChartableData<FactionName>;
};

// Victory chart's accepted data format
export type ChartableData<T extends string | number = number> = {
  x: T;
  y: number;
}[];

export type ResolvedDeck = Omit<Deck, "sideSlots"> & {
  attachments: AttachmentQuantities | undefined;
  availableAttachments: AttachableDefinition[];
  cardPool?: string[];
  metaParsed: DeckMeta;
  sideSlots: Record<string, number> | null; // arkhamdb stores `[]` when empty, normalize to `null`.
  extraSlots: Record<string, number> | null;
  exileSlots: Record<string, number>;
  customizations?: Customizations;
  cards: {
    investigator: CardWithRelations; // tracks relations.
    exileSlots: Record<string, ResolvedCard>;
    slots: Record<string, ResolvedCard>;
    sideSlots: Record<string, ResolvedCard>;
    ignoreDeckLimitSlots: Record<string, ResolvedCard>;
    extraSlots: Record<string, ResolvedCard>; // used by parallel jim.
  };
  investigatorFront: CardWithRelations;
  investigatorBack: CardWithRelations;
  stats: {
    xpRequired: number;
    deckSize: number;
    deckSizeTotal: number;
    charts: DecksChartInfo;
  };
  hasExtraDeck: boolean;
  hasReplacements: boolean;
  hasParallel: boolean;
  sealedDeck?: SealedDeck;
  selections?: Selections;
  tabooSet?: TabooSet;

  groups: Groupings;
  bondedSlots: Record<string, number>;
};

export function isResolvedDeck(a: unknown): a is ResolvedDeck {
  return (a as ResolvedDeck)?.investigatorFront != null;
}

export type CardSet = {
  canSetQuantity?: boolean;
  canSelect?: boolean;
  cards: ResolvedCard[];
  id: string;
  quantities?: Record<string, number>;
  selected: boolean;
  title: string;
  help?: string;
};
