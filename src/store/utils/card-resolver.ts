import type {
  Card,
  Cycle,
  EncounterSet,
  Pack,
  SubType,
  Type,
} from "../services/types";
import type { LookupTables } from "../slices/lookup-tables/types";
import type { Metadata } from "../slices/metadata/types";
import { applyTaboo } from "../utils/taboos";

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
    duplicates?: CardResolved[];

    level?: CardResolved[];
  };
};

// TODO: refactor into a "real" selector.
export function resolveCardWithRelations<T extends boolean>(
  metadata: Metadata,
  lookupTables: LookupTables,
  code: string | undefined,
  tabooSetId: number | null,
  withRelations?: T,
): T extends true ? CardWithRelations | undefined : CardResolved | undefined {
  if (!code) return undefined;

  let card = metadata.cards[code];
  if (!card) return undefined;

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
    ? resolveCardWithRelations(
        metadata,
        lookupTables,
        card.back_link_id,
        tabooSetId,
      )
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

  if (withRelations) {
    if (card.type_code === "investigator") {
      cardWithRelations.relations = {
        advanced: resolveRelationArray(
          metadata,
          lookupTables,
          "advanced",
          card.code,
          tabooSetId,
        ),
        parallel: resolveRelation(
          metadata,
          lookupTables,
          "parallel",
          card.code,
          tabooSetId,
        ),
        replacement: resolveRelationArray(
          metadata,
          lookupTables,
          "replacement",
          card.code,
          tabooSetId,
        ),
        requiredCards: resolveRelationArray(
          metadata,
          lookupTables,
          "requiredCards",
          card.code,
          tabooSetId,
        ),
        parallelCards: resolveRelationArray(
          metadata,
          lookupTables,
          "parallelCards",
          card.code,
          tabooSetId,
        ),
      };
    } else {
      cardWithRelations.relations = {
        restrictedTo: resolveRelation(
          metadata,
          lookupTables,
          "restrictedTo",
          card.code,
          tabooSetId,
        ),
        level: resolveRelationArray(
          metadata,
          lookupTables,
          "level",
          card.code,
          tabooSetId,
        ),
      };
    }

    cardWithRelations.relations.duplicates = resolveRelationArray(
      metadata,
      lookupTables,
      "duplicates",
      card.code,
      tabooSetId,
      false,
    );

    cardWithRelations.relations.bound = resolveRelationArray(
      metadata,
      lookupTables,
      "bound",
      card.code,
      tabooSetId,
    );

    cardWithRelations.relations.bonded = resolveRelationArray(
      metadata,
      lookupTables,
      "bonded",
      card.code,
      tabooSetId,
    );
  }

  return cardWithRelations;
}

function resolveRelation(
  metadata: Metadata,
  lookupTables: LookupTables,
  key: keyof LookupTables["relations"],
  code: string,
  tabooSetId: number | null,
): CardResolved | undefined {
  const relations = resolveRelationArray(
    metadata,
    lookupTables,
    key,
    code,
    tabooSetId,
  );
  return relations.length ? relations[0] : undefined;
}

function resolveRelationArray(
  metadata: Metadata,
  lookupTables: LookupTables,
  key: keyof LookupTables["relations"],
  code: string,
  tabooSetId: number | null,
  ignoreDuplicates = true,
): CardResolved[] {
  const relation = lookupTables.relations[key];

  const relations = relation[code]
    ? Object.keys(relation[code]).reduce<CardWithRelations[]>((acc, code) => {
        const card = resolveCardWithRelations(
          metadata,
          lookupTables,
          code,
          tabooSetId,
          false,
        );

        if (card && (!ignoreDuplicates || !card.card.duplicate_of_code)) {
          acc.push(card);
        }

        return acc;
      }, [])
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
