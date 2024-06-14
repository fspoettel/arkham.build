import { parse } from "graphql";
import request, { gql } from "graphql-request";
import factions from "./data/factions.json";
import types from "./data/types.json";
import subTypes from "./data/subtypes.json";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  Card,
  Cycle,
  DataVersion,
  Faction,
  Pack,
  SubType,
  Type,
} from "./types";

type DataVersionResponse = {
  all_card_updated: DataVersion[];
};

const dataVersionQuery: TypedDocumentNode<DataVersionResponse> = parse(gql`
  {
    all_card_updated(where: { locale: { _eq: "en" } }, limit: 1) {
      card_count
      cards_updated_at
      locale
      translation_updated_at
    }
  }
`);

export type MetadataResponse = {
  cycle: Cycle[];
  faction: Faction[];
  pack: Pack[];
  subtype: SubType[];
  type: Type[];
};

const metadataQuery: TypedDocumentNode<MetadataResponse> = parse(gql`
  {
    pack(where: { official: { _eq: true } }) {
      code
      cycle_code
      official
      position
      real_name
    }
    cycle(where: { official: { _eq: true } }) {
      code
      official
      position
      real_name
    }
  }
`);

type AllCardResponse = {
  all_card: Card[];
};

const allCardQuery: TypedDocumentNode<AllCardResponse> = parse(gql`
  {
    all_card(
      where: { official: { _eq: true }, taboo_set_id: { _is_null: true } }
    ) {
      alt_art_investigator
      alternate_of_code
      alternate_required_code
      back_illustrator
      back_link_id
      backimagesrc
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
      hidden
      # id
      illustrator
      imagesrc
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
      # real_back_traits
      real_customization_change
      real_customization_text
      real_encounter_set_name
      real_flavor
      real_name
      # real_pack_name
      real_slot
      real_subname
      # real_taboo_original_back_text
      # real_taboo_original_text
      # real_taboo_text_change
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
      # spoiler
      stage
      subtype_code
      # taboo_placeholder
      # taboo_set_id
      # tags
      type_code
      # updated_at
      vengeance
      # version
      victory
      xp
    }
  }
`);

const graphqlUrl = import.meta.env.VITE_GRAPHQL_DATA_ENDPOINT;

async function stub<T>(path: string): Promise<T> {
  return import(/* @vite-ignore */ path).then((p) => p.default as T);
}

export async function queryMetadata() {
  const data = import.meta.env.DEV
    ? await stub<MetadataResponse>("./data/stubs/metadata.json")
    : await request(graphqlUrl, metadataQuery);

  return {
    ...data,
    faction: factions,
    type: types,
    subtype: subTypes,
  };
}

export async function queryDataVersion() {
  const data = import.meta.env.DEV
    ? await stub<DataVersionResponse>("./data/stubs/data_version.json")
    : await request(graphqlUrl, dataVersionQuery);

  return data.all_card_updated[0];
}

export async function queryCards() {
  const data = import.meta.env.DEV
    ? await stub<AllCardResponse>("./data/stubs/all_card.json")
    : await request(graphqlUrl, allCardQuery);

  return data.all_card;
}
