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
  [key in `cus_${string}`]?: string | null;
} & {
  alternate_front?: string | null;
  alternate_back?: string | null;
  option_selected?: string | null;
  faction_selected?: string | null;
  faction_1?: string | null;
  faction_2?: string | null;
  deck_size_selected?: string | null;
  extra_deck?: string | null;
};

export type DeckSizeSelection = {
  type: "deckSize";
  value: number;
  options: number[];
  name: string;
  accessor: string;
};

export type FactionSelection = {
  type: "faction";
  value?: string;
  options: string[];
  name: string;
  accessor: string;
};

export type OptionSelection = {
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

export type ResolvedDeck<T extends ResolvedCard | CardWithRelations> = Omit<
  Deck,
  "sideSlots"
> & {
  metaParsed: DeckMeta;
  sideSlots: Record<string, number> | null; // arkhamdb stores `[]` when empty, normalize to `null`.
  extraSlots: Record<string, number> | null;
  customizations?: Customizations;
  cards: {
    investigator: CardWithRelations; // tracks relations.
    slots: Record<string, T>;
    sideSlots: Record<string, T>;
    ignoreDeckLimitSlots: Record<string, T>;
    extraSlots: Record<string, T>; // used by parallel jim.
  };
  investigatorFront: CardWithRelations;
  investigatorBack: CardWithRelations;
  stats: {
    xpRequired: number;
    deckSize: number;
    deckSizeTotal: number;
  };
  hasExtraDeck: boolean;
  hasReplacements: boolean;
  hasParallel: boolean;
  selections?: Selections;
  tabooSet?: TabooSet;
};
