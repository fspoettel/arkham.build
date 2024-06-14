import { StateCreator } from "zustand";
import { StoreState } from "..";
import {
  ACTION_TEXT,
  REGEX_SKILL_BOOST,
  REGEX_USES,
  SKILL_KEYS,
} from "@/utils/constants";
import { Card } from "@/store/graphql/types";
import { splitMultiValue } from "@/utils/card-utils";
import { LookupTable, LookupTables, LookupTablesSlice } from "./types";

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
      multislot: {},
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
  setInLookupTable(card.code, tables.faction_code, card.faction_code);
  setInLookupTable(card.code, tables.pack_code, card.code);
  setInLookupTable(card.code, tables.type_code, card.type_code);

  if (card.subtype_code) {
    setInLookupTable(card.code, tables.subtype_code, card.subtype_code);
  }

  if (card.encounter_code) {
    setInLookupTable(card.code, tables.encounter_code, card.encounter_code);
  }
}

function indexByTraits(tables: LookupTables, card: Card) {
  splitMultiValue(card.real_traits).forEach((trait) => {
    if (trait) setInLookupTable(card.code, tables.traits, trait);
  });
}

function indexByActions(tables: LookupTables, card: Card) {
  // add card to action tables.
  Object.entries(ACTION_TEXT).forEach(([key, value]) => {
    if (card.real_text?.includes(value)) {
      setInLookupTable(card.code, tables.actions, key);
    }
  });
}

// TODO: handle edge cases ("as fast as you can")
function indexByFast(tables: LookupTables, card: Card) {
  if (
    card?.real_text?.startsWith("Fast.") ||
    card?.real_text?.includes("fast")
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

function indexBySkillIcons(tables: LookupTables, card: Card) {
  SKILL_KEYS.forEach((key) => {
    const val = card[`skill_${key}`];
    if (val && card.type_code !== "investigator") {
      setInLookupTable(card.code, tables.skill_icons, key);
      if (val > 1) setInLookupTable(card.code, tables.skill_icons, "2+");
    }
  });
}

function indexByMulticlass(tables: LookupTables, card: Card) {
  if (card.faction2_code) {
    setInLookupTable(card.code, tables.properties, "multiclass");
    setInLookupTable(card.code, tables.faction_code, card.faction2_code);
  }

  if (card.faction3_code) {
    setInLookupTable(card.code, tables.faction_code, card.faction3_code);
  }
}

function indexByHealth(tables: LookupTables, card: Card) {
  if (card.health) setInLookupTable(card.code, tables.health, card.health);
}

function indexBySanity(tables: LookupTables, card: Card) {
  if (card.sanity) setInLookupTable(card.code, tables.sanity, card.sanity);
}

function indexByBonded(tables: LookupTables, card: Card) {
  if (card?.real_text?.startsWith("Bonded")) {
    setInLookupTable(card.code, tables.properties, "bonded");
  }
}

function indexBySeal(tables: LookupTables, card: Card) {
  if (card?.real_text?.includes("Seal (")) {
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
      setInLookupTable(card.code, tables.skill_boosts, match[1]);
    }
  }
}

function indexByUses(tables: LookupTables, card: Card) {
  const match = card.real_text?.match(REGEX_USES);
  if (match && match.length > 0) {
    setInLookupTable(card.code, tables.uses, match[1]);
  }
}

function sortedByName(tables: LookupTables, card: Card, i: number) {
  tables.sort.alphabetical[card.code] = i;
}

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

// function indexByProperties(tables: tables, card: Card) {
//   if (card.exile) {
//     setInLookupTable(tables, "properties", card.code, "exile");
//   }

//   if (card.heals_damage) {
//     setInLookupTable(tables, "properties", card.code, "heals_damage");
//   }

//   if (card.heals_horror) {
//     setInLookupTable(tables, "properties", card.code, "heals_horror");
//   }

//   if (card.exceptional) {
//     setInLookupTable(tables, "properties", card.code, "exceptional");
//   }

//   if (card.permanent) {
//     setInLookupTable(tables, "properties", card.code, "permanent");
//   }

//   if (card.myriad) {
//     setInLookupTable(tables, "properties", card.code, "myriad");
//   }

//   if (card.customization_options) {
//     setInLookupTable(tables, "properties", card.code, "customizable");
//   }

//   if (card.victory) {
//     setInLookupTable(tables, "properties", card.code, "victory");
//   }
// }

// function indexByUnique(tables: tables, card: Card) {
//   if (card.is_unique) {
//     setInLookupTable(tables, "properties", card.code, "is_unique");
//   }
// }
