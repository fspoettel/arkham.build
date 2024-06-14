import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import factions from "@/data/factions.json";
import types from "@/data/types.json";
import subTypes from "@/data/subtypes.json";
import { Card, Index, State } from "./schema";
import { storageConfig } from "./storage";
import {
  isPlayerCard,
  mappedByCode,
  setInIndex,
  splitMultiValue,
} from "./utils";
import { queryCards, queryDataVersion, queryMetadata } from "./graphql";
import { ACTION_TEXT } from "@/store/constants";

const REGEX_SKILL_BOOST = /\+\d+?\s\[(.+?)\]/g;
const REGEX_USES = /^Uses\s\(\d+?\s(\w+?)\)/;

export const useStore = create<State>()(
  devtools(
    persist(
      () =>
        ({
          dataVersion: undefined,
          cards: {},
          cycles: {},
          packs: {},
          indexes: {},
          factions: mappedByCode(factions),
          subtypes: mappedByCode(subTypes),
          types: mappedByCode(types),
        }) as State,
      storageConfig,
    ),
  ),
);

/*
 * Actions
 * @see https://docs.pmnd.rs/zustand/guides/practice-with-no-store-actions
 */

/**
 * Query card data and metadata from arkham-cards graphQL API.
 */
export async function queryCardData() {
  const [metadata, dataVersion, cards] = await Promise.all([
    queryMetadata(),
    queryDataVersion(),
    queryCards(),
  ]);

  const cardMap: Record<string, Card> = {};

  const indexes: Record<string, Index> = {
    byAction: {},
    byCost: {},
    byEncounterCode: {},
    byFactionCode: {},
    byHealth: {},
    byIcons: {},
    byPackCode: {},
    bySlot: {},
    bySubtypeCode: {},
    byProperties: {},
    bySanity: {},
    bySkillBoost: {},
    byTrait: {},
    byTypeCode: {},
    byUses: {},
    byXp: {},
  };

  console.time("create_store_data");
  cards.forEach((c) => {
    // resolve graphql relations.
    const card = c as Card;
    card.linked_card_code = c.linked_card?.code;
    cardMap[card.code] = card;
    addCardToIndexes(indexes, card);
  });

  console.timeEnd("create_store_data");

  console.time("set_initial_state");
  useStore.setState({
    dataVersion,
    cycles: mappedByCode(metadata.cycle),
    packs: mappedByCode(metadata.pack),
    cards: cardMap,
    indexes,
  });
  console.timeEnd("set_initial_state");
}

function addCardToIndexes(indexes: Record<string, Index>, card: Card) {
  const playerCard = isPlayerCard(card);

  setInIndex(indexes.byFactionCode, card.code, card.faction_code);
  setInIndex(indexes.byPackCode, card.code, card.pack_code);
  setInIndex(indexes.byTypeCode, card.code, card.type_code);

  if (card.subtype_code) {
    setInIndex(indexes.bySubtypeCode, card.code, card.subtype_code);
  }

  // add card to trait indexes, taking into account multi-traited cards.
  splitMultiValue(card.real_traits).forEach((trait) => {
    if (trait) setInIndex(indexes.byTrait, card.code, trait);
  });

  // add card to action indexes.
  Object.entries(ACTION_TEXT).forEach(([key, value]) => {
    if (card.real_text?.includes(value)) {
      setInIndex(indexes.byAction, card.code, key);
    }
  });

  if (card.victory) setInIndex(indexes.byProperties, card.code, "victory");

  if (card.is_unique) {
    setInIndex(indexes.byProperties, card.code, "is_unique");
  } else {
    setInIndex(indexes.byProperties, card.code, "non_unique");
  }

  // handle fast keyword.
  // TODO: handle edge cases ("as fast as you can")
  if (
    card?.real_text?.startsWith("Fast.") ||
    card?.real_text?.includes("fast")
  ) {
    setInIndex(indexes.byProperties, card.code, "fast");
  }

  // handle additional index based on whether we are dealing with a player card or not.
  if (playerCard) {
    if (card.cost) setInIndex(indexes.byCost, card.code, card.cost);
    if (card.xp) setInIndex(indexes.byXp, card.code, card.xp);
    if (card.real_slot) setInIndex(indexes.bySlot, card.code, card.real_slot);
    if (card.health) setInIndex(indexes.byHealth, card.code, card.health);
    if (card.sanity) setInIndex(indexes.bySanity, card.code, card.sanity);

    if (card.faction2_code) {
      setInIndex(indexes.byFactionCode, card.code, card.faction2_code);
    }

    if (card.faction3_code) {
      setInIndex(indexes.byFactionCode, card.code, card.faction3_code);
    }

    const skillKeys = [
      "agility",
      "combat",
      "intellect",
      "willpower",
      "wild",
    ] as const;

    skillKeys.forEach((key) => {
      const val = card[`skill_${key}`];

      if (val) {
        setInIndex(indexes.byIcons, card.code, key);
        if (val > 1) setInIndex(indexes.byIcons, card.code, "2+");
      }
    });

    if (card.myriad) setInIndex(indexes.byProperties, card.code, "myriad");

    if (card.permanent) {
      setInIndex(indexes.byProperties, card.code, "permanent");
    }

    if (card.exceptional) {
      setInIndex(indexes.byProperties, card.code, "exceptional");
    }

    if (card.exile) {
      setInIndex(indexes.byProperties, card.code, "exile");
    }

    if (card.heals_damage) {
      setInIndex(indexes.byProperties, card.code, "heals_damage");
    }

    if (card.heals_horror) {
      setInIndex(indexes.byProperties, card.code, "heals_horror");
    }

    if (card.encounter_code) {
      setInIndex(indexes.byProperties, card.code, "campaign_player_card");
    }

    if (card.customization_options) {
      setInIndex(indexes.byProperties, card.code, "customizable");
    }

    // handle bonded keyword.
    if (card?.real_text?.startsWith("Bonded")) {
      setInIndex(indexes.byProperties, card.code, "bonded");
    }

    // handle seal keyword.
    if (card?.real_text?.includes("Seal (")) {
      setInIndex(indexes.byProperties, card.code, "seal");
    }

    if (card.type_code === "asset") {
      splitMultiValue(card.real_slot).forEach((slot) => {
        setInIndex(indexes.bySlot, card.code, slot);
      });
    }

    if (card.type_code === "asset" && card.real_text) {
      // handle static skill boosts.
      // TODO: handle "+X skill value".
      for (const match of card.real_text.matchAll(REGEX_SKILL_BOOST)) {
        if (match.length > 0)
          setInIndex(indexes.bySkillBoost, card.code, match[1]);
      }

      // handle uses keyword.
      const match = card.real_text.match(REGEX_USES);
      if (match && match.length > 0)
        setInIndex(indexes.byUses, card.code, match[1]);
    }
  } else {
    if (card.encounter_code) {
      setInIndex(indexes.byEncounterCode, card.code, card.encounter_code);
    }
    // TODO: add enemy filters.
  }
}
