import { StateCreator } from "zustand";
import { StoreState } from "..";
import { Indexes, IndexesSlice } from "./types";
import { setInIndex } from "./utils";
import {
  ACTION_TEXT,
  REGEX_SKILL_BOOST,
  REGEX_USES,
  SKILL_KEYS,
} from "@/utils/constants";
import { Card } from "@/store/graphql/types";
import { splitMultiValue } from "@/utils/card-utils";

export const createIndexesSlice: StateCreator<
  StoreState,
  [],
  [],
  IndexesSlice
> = (set) => ({
  indexes: {
    // => actions.
    actions: {},
    card_list: {},
    cost: {},
    encounter_code: {},
    faction_code: {},
    pack_code: {},
    subtype_code: {},
    type_code: {},
    health: {},
    multiclass: {},
    properties: {},
    skill_icons: {},
    slots: {},
    sanity: {},
    skill_boosts: {},
    sort: {},
    traits: {},
    uses: {},
    level: {},
  },
  createIndexes(cards) {
    const indexes = {} as Indexes;

    cards.forEach((card, i) => {
      addCardToIndexes(indexes, card, i);
    });

    set({ indexes });
  },
});

export function addCardToIndexes(indexes: Indexes, card: Card, i: number) {
  sortedByName(indexes, card, i);

  indexByCodes(indexes, card);
  indexByTraits(indexes, card);
  indexByActions(indexes, card);
  indexByUnique(indexes, card);
  indexByFast(indexes, card);

  // handle additional index based on whether we are dealing with a player card or not.
  if (card.faction_code !== "mythos") {
    indexByCost(indexes, card);
    indexByLevel(indexes, card);

    indexByHealth(indexes, card);
    indexBySanity(indexes, card);

    indexByMulticlass(indexes, card);
    indexBySkillIcons(indexes, card);

    indexByBonded(indexes, card);
    indexBySeal(indexes, card);

    if (card.type_code === "asset") {
      indexBySlots(indexes, card);
      indexBySkillBoosts(indexes, card);
      indexByUses(indexes, card);
    }
  } else {
    // TODO: add enemy filters.
  }
}

function indexByCodes(indexes: Indexes, card: Card) {
  setInIndex(indexes, "faction_code", card.code, card.faction_code);
  setInIndex(indexes, "pack_code", card.code, card.pack_code);
  setInIndex(indexes, "type_code", card.code, card.type_code);

  if (card.subtype_code) {
    setInIndex(indexes, "subtype_code", card.code, card.subtype_code);
  }

  if (card.encounter_code) {
    setInIndex(indexes, "encounter_code", card.code, card.encounter_code);
  }
}

function indexByTraits(indexes: Indexes, card: Card) {
  splitMultiValue(card.real_traits).forEach((trait) => {
    if (trait) setInIndex(indexes, "traits", card.code, trait);
  });
}

function indexByUnique(indexes: Indexes, card: Card) {
  if (card.is_unique) {
    setInIndex(indexes, "properties", card.code, "is_unique");
  }
}

function indexByActions(indexes: Indexes, card: Card) {
  // add card to action indexes.
  Object.entries(ACTION_TEXT).forEach(([key, value]) => {
    if (card.real_text?.includes(value)) {
      setInIndex(indexes, "actions", card.code, key);
    }
  });
}

// TODO: handle edge cases ("as fast as you can")
function indexByFast(indexes: Indexes, card: Card) {
  if (
    card?.real_text?.startsWith("Fast.") ||
    card?.real_text?.includes("fast")
  ) {
    setInIndex(indexes, "properties", card.code, "fast");
  }
}

function indexByCost(indexes: Indexes, card: Card) {
  if (card.cost) setInIndex(indexes, "cost", card.code, card.cost);
}

function indexByLevel(indexes: Indexes, card: Card) {
  if (card.xp) setInIndex(indexes, "level", card.code, card.xp);
}

function indexBySkillIcons(indexes: Indexes, card: Card) {
  SKILL_KEYS.forEach((key) => {
    const val = card[`skill_${key}`];
    if (val) {
      setInIndex(indexes, "skill_icons", card.code, key);
      if (val > 1) setInIndex(indexes, "skill_icons", card.code, "2+");
    }
  });
}

function indexByMulticlass(indexes: Indexes, card: Card) {
  if (card.faction2_code) {
    setInIndex(indexes, "properties", card.code, "multiclass");
    setInIndex(indexes, "faction_code", card.code, card.faction2_code);
  }

  if (card.faction3_code) {
    setInIndex(indexes, "faction_code", card.code, card.faction3_code);
  }
}

function indexByHealth(indexes: Indexes, card: Card) {
  if (card.health) setInIndex(indexes, "health", card.code, card.health);
}

function indexBySanity(indexes: Indexes, card: Card) {
  if (card.sanity) setInIndex(indexes, "sanity", card.code, card.sanity);
}

function indexByBonded(indexes: Indexes, card: Card) {
  if (card?.real_text?.startsWith("Bonded")) {
    setInIndex(indexes, "properties", card.code, "bonded");
  }
}

function indexBySeal(indexes: Indexes, card: Card) {
  if (card?.real_text?.includes("Seal (")) {
    setInIndex(indexes, "properties", card.code, "seal");
  }
}

function indexBySlots(indexes: Indexes, card: Card) {
  if (card.real_slot) {
    setInIndex(indexes, "slots", card.code, card.real_slot);

    splitMultiValue(card.real_slot).forEach((slot) => {
      setInIndex(indexes, "slots", card.code, slot);
    });
  }
}

// TODO: handle "+X skill value".
function indexBySkillBoosts(indexes: Indexes, card: Card) {
  const matches = card.real_text?.matchAll(REGEX_SKILL_BOOST);
  if (!matches) return;

  for (const match of matches) {
    if (match.length > 0)
      setInIndex(indexes, "skill_boosts", card.code, match[1]);
  }
}

function indexByUses(indexes: Indexes, card: Card) {
  const match = card.real_text?.match(REGEX_USES);
  if (match && match.length > 0) {
    setInIndex(indexes, "uses", card.code, match[1]);
  }
}

function sortedByName(indexes: Indexes, card: Card, i: number) {
  setInIndex(indexes, "sort", card.code, "alphabetical", i);
}

// function indexByProperties(indexes: Indexes, card: Card) {
//   if (card.exile) {
//     setInIndex(indexes, "properties", card.code, "exile");
//   }

//   if (card.heals_damage) {
//     setInIndex(indexes, "properties", card.code, "heals_damage");
//   }

//   if (card.heals_horror) {
//     setInIndex(indexes, "properties", card.code, "heals_horror");
//   }

//   if (card.exceptional) {
//     setInIndex(indexes, "properties", card.code, "exceptional");
//   }

//   if (card.permanent) {
//     setInIndex(indexes, "properties", card.code, "permanent");
//   }

//   if (card.myriad) {
//     setInIndex(indexes, "properties", card.code, "myriad");
//   }

//   if (card.customization_options) {
//     setInIndex(indexes, "properties", card.code, "customizable");
//   }

//   if (card.victory) {
//     setInIndex(indexes, "properties", card.code, "victory");
//   }
// }
