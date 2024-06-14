import { StateCreator } from "zustand";
import { StoreState } from "..";
import { setInLut } from "./utils";
import {
  ACTION_TEXT,
  REGEX_SKILL_BOOST,
  REGEX_USES,
  SKILL_KEYS,
} from "@/utils/constants";
import { Card } from "@/store/graphql/types";
import { splitMultiValue } from "@/utils/card-utils";
import { LookupTables, LookupTablesSlice } from "./types";

export function getInitialLookupTables(): LookupTables {
  return {
    // => actions.
    actions: {},
    cost: {},
    encounter_code: {},
    faction_code: {},
    pack_code: {},
    subtype_code: {},
    type_code: {},
    health: {},
    properties: {
      fast: {},
      bonded: {},
      multiclass: {},
      seal: {},
    },
    skill_icons: {},
    slots: {},
    sanity: {},
    skill_boosts: {},
    sort: {
      alphabetical: {},
    },
    traits: {},
    uses: {},
    level: {},
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
    indexBySkillIcons(tables, card);

    indexByBonded(tables, card);
    indexBySeal(tables, card);

    if (card.type_code === "asset") {
      indexBySlots(tables, card);
      indexBySkillBoosts(tables, card);
      indexByUses(tables, card);
    }
  } else {
    // TODO: add enemy filters.
  }
}

function indexByCodes(tables: LookupTables, card: Card) {
  setInLut(card.code, tables.faction_code, card.faction_code);
  setInLut(card.code, tables.pack_code, card.code);
  setInLut(card.code, tables.type_code, card.type_code);

  if (card.subtype_code) {
    setInLut(card.code, tables.subtype_code, card.subtype_code);
  }

  if (card.encounter_code) {
    setInLut(card.code, tables.encounter_code, card.encounter_code);
  }
}

function indexByTraits(tables: LookupTables, card: Card) {
  splitMultiValue(card.real_traits).forEach((trait) => {
    if (trait) setInLut(card.code, tables.traits, trait);
  });
}

function indexByActions(tables: LookupTables, card: Card) {
  // add card to action tables.
  Object.entries(ACTION_TEXT).forEach(([key, value]) => {
    if (card.real_text?.includes(value)) {
      setInLut(card.code, tables.actions, key);
    }
  });
}

// TODO: handle edge cases ("as fast as you can")
function indexByFast(tables: LookupTables, card: Card) {
  if (
    card?.real_text?.startsWith("Fast.") ||
    card?.real_text?.includes("fast")
  ) {
    setInLut(card.code, tables.properties, "fast");
  }
}

function indexByCost(tables: LookupTables, card: Card) {
  if (card.cost) setInLut(card.code, tables.cost, card.cost);
}

function indexByLevel(tables: LookupTables, card: Card) {
  if (card.xp) setInLut(card.code, tables.level, card.xp);
}

function indexBySkillIcons(tables: LookupTables, card: Card) {
  SKILL_KEYS.forEach((key) => {
    const val = card[`skill_${key}`];
    if (val) {
      setInLut(card.code, tables.skill_icons, key);
      if (val > 1) setInLut(card.code, tables.skill_icons, "2+");
    }
  });
}

function indexByMulticlass(tables: LookupTables, card: Card) {
  if (card.faction2_code) {
    setInLut(card.code, tables.properties, "multiclass");
    setInLut(card.code, tables.faction_code, card.faction2_code);
  }

  if (card.faction3_code) {
    setInLut(card.code, tables.faction_code, card.faction3_code);
  }
}

function indexByHealth(tables: LookupTables, card: Card) {
  if (card.health) setInLut(card.code, tables.health, card.health);
}

function indexBySanity(tables: LookupTables, card: Card) {
  if (card.sanity) setInLut(card.code, tables.sanity, card.sanity);
}

function indexByBonded(tables: LookupTables, card: Card) {
  if (card?.real_text?.startsWith("Bonded")) {
    setInLut(card.code, tables.properties, "bonded");
  }
}

function indexBySeal(tables: LookupTables, card: Card) {
  if (card?.real_text?.includes("Seal (")) {
    setInLut(card.code, tables.properties, "seal");
  }
}

function indexBySlots(tables: LookupTables, card: Card) {
  if (card.real_slot) {
    setInLut(card.code, tables.slots, card.real_slot);

    splitMultiValue(card.real_slot).forEach((slot) => {
      setInLut(card.code, tables.slots, slot);
    });
  }
}

// TODO: handle "+X skill value".
function indexBySkillBoosts(tables: LookupTables, card: Card) {
  const matches = card.real_text?.matchAll(REGEX_SKILL_BOOST);
  if (!matches) return;

  for (const match of matches) {
    if (match.length > 0) {
      setInLut(card.code, tables.skill_boosts, match[1]);
    }
  }
}

function indexByUses(tables: LookupTables, card: Card) {
  const match = card.real_text?.match(REGEX_USES);
  if (match && match.length > 0) {
    setInLut(card.code, tables.uses, match[1]);
  }
}

function sortedByName(tables: LookupTables, card: Card, i: number) {
  tables.sort.alphabetical[card.code] = i;
}

// function indexByProperties(tables: tables, card: Card) {
//   if (card.exile) {
//     setInLut(tables, "properties", card.code, "exile");
//   }

//   if (card.heals_damage) {
//     setInLut(tables, "properties", card.code, "heals_damage");
//   }

//   if (card.heals_horror) {
//     setInLut(tables, "properties", card.code, "heals_horror");
//   }

//   if (card.exceptional) {
//     setInLut(tables, "properties", card.code, "exceptional");
//   }

//   if (card.permanent) {
//     setInLut(tables, "properties", card.code, "permanent");
//   }

//   if (card.myriad) {
//     setInLut(tables, "properties", card.code, "myriad");
//   }

//   if (card.customization_options) {
//     setInLut(tables, "properties", card.code, "customizable");
//   }

//   if (card.victory) {
//     setInLut(tables, "properties", card.code, "victory");
//   }
// }

// function indexByUnique(tables: tables, card: Card) {
//   if (card.is_unique) {
//     setInLut(tables, "properties", card.code, "is_unique");
//   }
// }
