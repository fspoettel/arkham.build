import {
  Card,
  Cycle,
  EncounterSet,
  Pack,
  SubType,
  Type,
} from "../services/types";
import { StoreState } from "../slices";
import { LookupTables } from "../slices/lookup-tables/types";
import { applyTaboo } from "../utils/taboos";
import { selectCanonicalTabooSetId } from "./filters/tabooSet";

export type CardResolved = {
  card: Card;
  back?: CardResolved;
  encounterSet?: EncounterSet;
  cycle: Cycle;
  pack: Pack;
  subtype?: SubType;
  type: Type;
};

export type CardWithRelations = CardResolved & {
  relations?: {
    bound?: CardResolved[];
    bonded?: CardResolved[];

    restrictedTo?: CardResolved;
    parallel?: CardResolved;

    advanced?: CardResolved[];
    replacement?: CardResolved[];
    requiredCards?: CardResolved[];
    parallelCards?: CardResolved[];

    level?: CardResolved[];
  };
};

// TODO: refactor into a "real" selector.
export function selectCardWithRelations(
  state: StoreState,
  code?: string,
  skipRelations = false,
): CardWithRelations | undefined {
  if (!code) return undefined;

  let card = state.metadata.cards[code];
  if (!card) return undefined;

  const metadata = state.metadata;

  const tabooSetId = selectCanonicalTabooSetId(state);

  if (tabooSetId) {
    card = applyTaboo(card, tabooSetId, metadata);
  }

  const pack = metadata.packs[card.pack_code];
  const type = metadata.types[card.type_code];
  const cycle = metadata.cycles[pack.cycle_code];

  const subtype = card.subtype_code
    ? metadata.subtypes[card.subtype_code]
    : undefined;

  const encounterSet = card.encounter_code
    ? metadata.encounterSets[card.encounter_code]
    : undefined;

  const back = card.back_link_id
    ? selectCardWithRelations(state, card.back_link_id)
    : undefined;

  const cardWithRelations: CardWithRelations = {
    back,
    card,
    cycle,
    encounterSet,
    pack,
    subtype,
    type,
  };

  if (!skipRelations) {
    if (card.type_code === "investigator") {
      cardWithRelations.relations = {
        advanced: resolveRelationArray(state, "advanced", card.code),
        parallel: resolveRelation(state, "parallel", card.code),
        replacement: resolveRelationArray(state, "replacement", card.code),
        requiredCards: resolveRelationArray(state, "requiredCards", card.code),
        parallelCards: resolveRelationArray(state, "parallelCards", card.code),
      };
    } else {
      cardWithRelations.relations = {
        restrictedTo: resolveRelation(state, "restrictedTo", card.code),
        level: resolveRelationArray(state, "level", card.code),
      };
    }

    cardWithRelations.relations.bound = resolveRelationArray(
      state,
      "bound",
      card.code,
    );
    cardWithRelations.relations.bonded = resolveRelationArray(
      state,
      "bonded",
      card.code,
    );
  }

  return cardWithRelations;
}

function resolveRelation(
  state: StoreState,
  key: keyof LookupTables["relations"],
  code: string,
): CardResolved | undefined {
  const relations = resolveRelationArray(state, key, code);
  return relations.length ? relations[0] : undefined;
}

function resolveRelationArray(
  state: StoreState,
  key: keyof LookupTables["relations"],
  code: string,
): CardResolved[] {
  const relation = state.lookupTables.relations[key];
  const relations = relation[code]
    ? Object.keys(relation[code]).reduce((acc, code) => {
        const card = selectCardWithRelations(state, code, true);
        if (card && !card.card.duplicate_of_code) acc.push(card);
        return acc;
      }, [] as CardWithRelations[])
    : [];

  relations.sort(({ card: a }, { card: b }) => {
    if (a.subtype_code !== b.subtype_code) {
      return a.subtype_code ? 1 : -1;
    }

    if (a.xp === b.xp) {
      return (a.real_subname ?? "").localeCompare(b.real_subname ?? "");
    }

    return (a.xp ?? 0) - (b.xp ?? 0);
  });

  return relations;
}
