import { request } from "@/utils/graphql-request";

import factions from "./data/factions.json";
import reprintPacks from "./data/reprint_packs.json";
import subTypes from "./data/subtypes.json";
import types from "./data/types.json";
import type {
  Cycle,
  DataVersion,
  EncounterSet,
  Faction,
  Pack,
  QueryCard,
  SubType,
  TabooSet,
  Type,
} from "./types";

type DataVersionResponse = {
  all_card_updated: DataVersion[];
};

export type MetadataResponse = {
  cycle: Cycle[];
  faction: Faction[];
  pack: Pack[];
  reprint_pack: Pack[];
  subtype: SubType[];
  type: Type[];
  card_encounter_set: EncounterSet[];
  taboo_set: TabooSet[];
};

type AllCardResponse = {
  all_card: QueryCard[];
};

const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL;

async function stub<T>(path: string): Promise<T> {
  return import(/* @vite-ignore */ path).then((p) => p.default as T);
}

type MetadataApiResponseType = Omit<
  MetadataResponse,
  "faction" | "reprint_pack" | "type" | "subtype"
>;

export async function queryMetadata() {
  const data = import.meta.env.DEV
    ? await stub<MetadataApiResponseType>("./data/stubs/metadata.json")
    : await request<MetadataApiResponseType>(
        graphqlUrl,
        `
    {
      pack(where: { official: { _eq: true } }) {
        code
        cycle_code
        position
        real_name
      }
      cycle(where: { official: { _eq: true } }) {
        code
        position
        real_name
      }
      card_encounter_set(
        where: { official: { _eq: true }, locale: { _eq: "en" } }
      ) {
        code
        name
      }
      taboo_set(where: { active: { _eq: true } }) {
        name
        card_count
        id
        date
      }
    }
  `,
      );

  return {
    ...data,
    reprint_pack: reprintPacks,
    faction: factions,
    type: types,
    subtype: subTypes,
  };
}

export async function queryDataVersion() {
  const data = import.meta.env.DEV
    ? await stub<DataVersionResponse>("./data/stubs/data_version.json")
    : await request<DataVersionResponse>(
        graphqlUrl,
        `
    {
      all_card_updated(where: { locale: { _eq: "en" } }, limit: 1) {
        card_count
        cards_updated_at
        locale
        translation_updated_at
      }
    }
  `,
      );
  return data.all_card_updated[0];
}

export async function queryCards() {
  const data = import.meta.env.DEV
    ? await stub<AllCardResponse>("./data/stubs/all_card.json")
    : await request<AllCardResponse>(
        graphqlUrl,
        `
    {
      all_card(
        where: {
          official: { _eq: true }
          _and: [{ taboo_placeholder: { _is_null: true } }]
          pack_code: { _neq: "zbh_00008" }
        }
      ) {
        alt_art_investigator
        alternate_of_code
        alternate_required_code
        back_illustrator
        back_link_id
        backimageurl
        clues
        clues_fixed
        code
        cost
        customization_options
        deck_limit
        deck_options
        deck_requirements
        doom
        double_sided
        duplicate_of_code
        encounter_code
        encounter_position
        enemy_damage
        enemy_evade
        enemy_fight
        enemy_horror
        errata_date
        exceptional
        exile
        faction_code
        faction2_code
        faction3_code
        heals_damage
        heals_horror
        health
        health_per_investigator
        hidden
        id # used for taboos
        illustrator
        imageurl
        is_unique
        linked
        linked_card {
          code
        }
        myriad
        official
        pack_code
        pack_position
        permanent
        position
        preview
        quantity
        real_back_flavor
        real_back_name
        real_back_text
        real_customization_change
        real_customization_text
        real_encounter_set_name
        real_flavor
        real_name
        real_slot
        real_subname
        real_taboo_text_change
        real_text
        real_traits
        restrictions
        sanity
        shroud
        side_deck_options
        side_deck_requirements
        skill_agility
        skill_combat
        skill_intellect
        skill_willpower
        skill_wild
        stage
        subtype_code
        taboo_set_id
        taboo_xp
        tags
        type_code
        vengeance
        victory
        xp
      }
    }
  `,
      );

  return data.all_card;
}

export type FaqResponse = {
  code: string;
  html: string;
  updated: {
    date: string;
  };
}[];

export async function queryFaq(code: string): Promise<FaqResponse> {
  return fetch(`https://arkhamdb.com/api/public/faq/${code}`).then((res) =>
    res.json(),
  );
}
