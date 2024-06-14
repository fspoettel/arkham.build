import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import factions from "@/data/factions.json";
import types from "@/data/types.json";
import subTypes from "@/data/subtypes.json";
import { Card, Index, State } from "./schema";
import { storageConfig } from "./storage";
import { mappedByCode, setInIndex, splitMultiValue } from "./utils";
import { queryCards, queryDataVersion, queryMetadata } from "./graphql";

export const useStore = create<State>()(
  devtools(
    persist(
      () =>
        ({
          dataVersion: undefined,
          cards: {},
          cycles: {},
          packs: {},
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

  console.time("create_indexes");

  const cardMap: Record<string, Card> = {};

  const byPlayerTrait: Index = {};

  const bySlot: Index = {};
  const byCost: Index = {};
  const byTypeCode: Index = {};
  const byFactionCode: Index = {};
  const byXp: Index = {};
  const byTrait: Index = {};

  cards.forEach((c) => {
    // resolve graphql relations.
    const card = c as Card;
    card.linked_card_code = c.linked_card?.code;

    cardMap[card.code] = card;

    const isPlayerCard =
      card.faction_code !== "mythos" && // enounter deck
      c.encounter_code == null && // campaign assets
      c.pack_code !== "zbh_00008"; // barkham horror.

    setInIndex(byFactionCode, c.code, c.faction_code);
    setInIndex(byTypeCode, c.code, c.type_code);

    // add card to trait indexes, taking into account multi-traited cards.
    splitMultiValue(c.real_traits).forEach((trait) => {
      if (trait) {
        setInIndex(byTrait, c.code, trait);
        if (isPlayerCard) {
          setInIndex(byPlayerTrait, c.code, 1);
        }
      }
    });

    if (isPlayerCard) {
      setInIndex(byCost, c.code, c.cost ?? -1);
      setInIndex(byXp, c.code, c.xp ?? -1);
      if (c.real_slot) setInIndex(bySlot, c.code, c.real_slot);

      // update indexes for multi-class cards.
      if (c.faction2_code) setInIndex(byFactionCode, c.code, c.faction2_code);
      if (c.faction3_code) setInIndex(byFactionCode, c.code, c.faction3_code);

      splitMultiValue(c.real_slot).forEach((slot) => {
        setInIndex(bySlot, c.code, slot);
      });
    }
  });

  console.log(Object.keys(byTypeCode["investigator"]));

  useStore.setState({
    dataVersion,
    cycles: mappedByCode(metadata.cycle),
    packs: mappedByCode(metadata.pack),
    cards: cardMap,
    indexes: {
      byPlayerTrait,
      byFactionCode,
      byTypeCode,
      byXp,
      byTrait,
    },
  });

  console.timeEnd("create_indexes");
}
