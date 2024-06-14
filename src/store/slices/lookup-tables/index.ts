import { StateCreator } from "zustand";

import { Card } from "@/store/graphql/types";
import { splitMultiValue } from "@/utils/card-utils";
import {
  ACTION_TEXT,
  REGEX_BONDED,
  REGEX_SKILL_BOOST,
  REGEX_USES,
} from "@/utils/constants";

import { StoreState } from "..";
import { CardTypeFilter } from "../filters/types";
import { Metadata } from "../metadata/types";
import { LookupTable, LookupTables, LookupTablesSlice } from "./types";

export function getInitialLookupTables(): LookupTables {
  return {
    dataVersion: undefined,
    relations: {
      bound: {},
      bonded: {},
      restrictedTo: {},
      requiredCards: {},
      parallel: {},
      parallelCards: {},
      advanced: {},
      replacement: {},
      level: {},
    },
    actions: {},
    cost: {},
    encounterCode: {},
    factionCode: {},
    packCode: {},
    subtypeCode: {},
    typeCode: {},
    health: {},
    properties: {
      fast: {},
      heals_damage: {},
      heals_horror: {},
      multislot: {},
      multiclass: {},
      seal: {},
    },
    skillBoosts: {},
    slots: {},
    sanity: {},
    sort: {
      alphabetical: {},
    },
    traits: {},
    uses: {},
    level: {},
    typesByCardTypeSelection: {},
    traitsByCardTypeSeletion: {},
  };
}

export const createLookupTablesSlice: StateCreator<
  StoreState,
  [],
  [],
  LookupTablesSlice
> = () => ({
  lookupTables: getInitialLookupTables(),
});

function setInLookupTable<T extends string | number>(
  code: keyof LookupTable<T>[T] | string,
  index: LookupTable<T>,
  key: T,
) {
  if (index[key]) {
    index[key][code] = 1;
  } else {
    index[key] = { [code]: 1 as const };
  }
}

export function addCardToLookupTables(
  tables: LookupTables,
  card: Card,
  i: number,
) {
  sortedByName(tables, card, i);

  indexByCodes(tables, card);
  indexByTraits(tables, card);
  indexByActions(tables, card);
  indexByFast(tables, card);

  // handle additional index based on whether we are dealing with a player card or not.
  if (card.faction_code !== "mythos") {
    indexByCost(tables, card);
    indexByLevel(tables, card);

    indexByHealth(tables, card);
    indexBySanity(tables, card);

    indexByMulticlass(tables, card);

    indexBySeal(tables, card);

    indexByHealsHorror(tables, card);
    indexByHealsDamage(tables, card);

    if (card.type_code === "asset") {
      indexBySlots(tables, card);
      indexBySkillBoosts(tables, card);
      indexByUses(tables, card);
    }
  } else {
    // TODO: add enemy filters.
  }

  if (card.encounter_code || card.faction_code === "mythos") {
    indexTypeByCardTypeSelection(tables, card.type_code, "encounter");
  } else {
    indexTypeByCardTypeSelection(tables, card.type_code, "player");
  }
}

function indexTypeByCardTypeSelection(
  tables: LookupTables,
  typeCode: string,
  cardType: CardTypeFilter,
) {
  setInLookupTable(typeCode, tables.typesByCardTypeSelection, cardType);
}

function indexByCodes(tables: LookupTables, card: Card) {
  setInLookupTable(card.code, tables.factionCode, card.faction_code);
  setInLookupTable(card.code, tables.packCode, card.code);
  setInLookupTable(card.code, tables.typeCode, card.type_code);

  if (card.subtype_code) {
    setInLookupTable(card.code, tables.subtypeCode, card.subtype_code);
  }

  if (card.encounter_code) {
    setInLookupTable(card.code, tables.encounterCode, card.encounter_code);
  }
}

function indexByTraits(tables: LookupTables, card: Card) {
  splitMultiValue(card.real_traits).forEach((trait) => {
    if (trait) {
      setInLookupTable(card.code, tables.traits, trait);
      if (card.encounter_code || card.faction_code === "mythos") {
        setInLookupTable(trait, tables.traitsByCardTypeSeletion, "encounter");
      } else {
        setInLookupTable(trait, tables.traitsByCardTypeSeletion, "player");
      }
    }
  });
}
``;
function indexByActions(tables: LookupTables, card: Card) {
  // add card to action tables.
  Object.entries(ACTION_TEXT).forEach(([key, value]) => {
    if (card.real_text?.includes(value)) {
      setInLookupTable(card.code, tables.actions, key);
    }
  });
}

// TODO: use a regex.
function indexByFast(tables: LookupTables, card: Card) {
  if (
    card?.real_text?.includes("Fast.") ||
    card.real_text?.includes("gains fast.")
  ) {
    setInLookupTable(card.code, tables.properties, "fast");
  }
}

function indexByCost(tables: LookupTables, card: Card) {
  if (card.cost) setInLookupTable(card.code, tables.cost, card.cost);
}

function indexByLevel(tables: LookupTables, card: Card) {
  if (card.xp) setInLookupTable(card.code, tables.level, card.xp);
}

function indexByMulticlass(tables: LookupTables, card: Card) {
  if (card.faction2_code) {
    setInLookupTable(card.code, tables.properties, "multiclass");
    setInLookupTable(card.code, tables.factionCode, card.faction2_code);
  }

  if (card.faction3_code) {
    setInLookupTable(card.code, tables.factionCode, card.faction3_code);
  }
}

function indexByHealth(tables: LookupTables, card: Card) {
  if (card.health) setInLookupTable(card.code, tables.health, card.health);
}

function indexBySanity(tables: LookupTables, card: Card) {
  if (card.sanity) setInLookupTable(card.code, tables.sanity, card.sanity);
}

// TODO: use a regex.
function indexBySeal(tables: LookupTables, card: Card) {
  if (
    card?.real_text?.includes(" seal ") ||
    card.real_text?.includes("Seal (")
  ) {
    setInLookupTable(card.code, tables.properties, "seal");
  }
}

function indexBySlots(tables: LookupTables, card: Card) {
  if (card.real_slot) {
    const allSlots = splitMultiValue(card.real_slot);

    if (allSlots.length > 1) {
      setInLookupTable(card.code, tables.slots, card.real_slot);
      setInLookupTable(card.code, tables.properties, "multislot");
    }

    allSlots.forEach((slot) => {
      setInLookupTable(card.code, tables.slots, slot);
    });
  } else if (card.permanent) {
    setInLookupTable(card.code, tables.slots, "Permanent");
  } else {
    setInLookupTable(card.code, tables.slots, "Slotless");
  }
}

// TODO: handle "+X skill value".
function indexBySkillBoosts(tables: LookupTables, card: Card) {
  const matches = card.real_text?.matchAll(REGEX_SKILL_BOOST);
  if (!matches) return;

  for (const match of matches) {
    if (match.length > 0) {
      setInLookupTable(card.code, tables.skillBoosts, match[1]);
    }
  }
}

function indexByUses(tables: LookupTables, card: Card) {
  const match = card.real_text?.match(REGEX_USES);
  if (match && match.length > 0) {
    setInLookupTable(card.code, tables.uses, match[1]);
  }
}

function indexByHealsDamage(tables: LookupTables, card: Card) {
  if (
    card.tags?.includes("hd") ||
    card.customization_options?.tags?.includes("hd")
  ) {
    setInLookupTable(card.code, tables.properties, "heals_damage");
  }
}

function indexByHealsHorror(tables: LookupTables, card: Card) {
  if (
    card.tags?.includes("hh") ||
    card.customization_options?.tags?.includes("hh")
  ) {
    setInLookupTable(card.code, tables.properties, "heals_horror");
  }
}

function sortedByName(tables: LookupTables, card: Card, i: number) {
  tables.sort.alphabetical[card.code] = i;
}

export function createRelations(metadata: Metadata, tables: LookupTables) {
  console.time("create_relations");
  const cards = Object.values(metadata.cards);

  const bonded: Record<string, string[]> = {};
  const upgrades: Record<
    string,
    { code: string; subname?: string; xp: number }[]
  > = {};

  // first pass: identify target cards.
  for (const card of cards) {
    if (card.xp && card.xp >= 0) {
      const upgrade = {
        code: card.code,
        subname: card.real_subname,
        xp: card.xp,
      };

      if (!upgrades[card.real_name]) {
        upgrades[card.real_name] = [upgrade];
      } else {
        upgrades[card.real_name].push(upgrade);
      }
    }

    const match = card.real_text?.match(REGEX_BONDED);

    if (match && match.length > 0) {
      if (!bonded[match[1]]) {
        bonded[match[1]] = [card.code];
      } else {
        bonded[match[1]].push(card.code);
      }
    }
  }

  // second pass: construct lookup tables.
  for (const card of cards) {
    if (card.deck_requirements?.card) {
      for (const code of Object.keys(card.deck_requirements.card)) {
        setInLookupTable(code, tables.relations.requiredCards, card.code);
      }
    }

    if (card.restrictions?.investigator) {
      // Can have multiple entries (alternate arts).
      for (const key of Object.keys(card.restrictions.investigator)) {
        const investigator = metadata.cards[key];

        if (investigator?.alt_art_investigator) {
          continue;
        }

        setInLookupTable(key, tables.relations.restrictedTo, card.code);

        if (card.real_text?.includes("Advanced.")) {
          setInLookupTable(card.code, tables.relations.advanced, key);
        } else if (card.real_text?.includes("Replacement.")) {
          setInLookupTable(card.code, tables.relations.replacement, key);
        } else {
          if (card.parallel) {
            setInLookupTable(card.code, tables.relations.parallelCards, key);
          } else {
            setInLookupTable(card.code, tables.relations.requiredCards, key);
          }
        }
      }
    }

    if (card.alt_art_investigator && card.alternate_of_code) {
      if (card.parallel) {
        setInLookupTable(
          card.code,
          tables.relations.parallel,
          card.alternate_of_code,
        );
      }
    }

    if (upgrades[card.real_name] && card.xp != null) {
      for (const upgrade of upgrades[card.real_name]) {
        if (
          card.code !== upgrade.code &&
          (!card.real_subname ||
            card.xp !== upgrade.xp ||
            upgrade.subname !== card.real_subname)
        ) {
          setInLookupTable(upgrade.code, tables.relations.level, card.code);
          setInLookupTable(card.code, tables.relations.level, upgrade.code);
        }
      }
    }

    // TODO: there is an edge case with Dream-Gate where the front should show when accessing `06015b` via
    // a bond, but currently does not.
    if (!card.linked && bonded[card.real_name]) {
      for (const bondedCode of bonded[card.real_name]) {
        // beware the great hank samson.
        if (bondedCode !== card.code && !card.real_text?.startsWith("Bonded")) {
          setInLookupTable(bondedCode, tables.relations.bound, card.code);
          setInLookupTable(card.code, tables.relations.bonded, bondedCode);
        }
      }
    }
  }

  console.timeEnd("create_relations");
}
