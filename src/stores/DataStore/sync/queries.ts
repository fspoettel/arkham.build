import { parse } from "graphql";
import { gql } from "graphql-request";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { AllCardUpdated, Card, Cycle, Pack } from "../schema";

export const dataVersionQuery: TypedDocumentNode<{
  all_card_updated: AllCardUpdated[];
}> = parse(gql`
  {
    all_card_updated(where: { locale: { _eq: "en" } }, limit: 1) {
      card_count
      cards_updated_at
      locale
      translation_updated_at
    }
  }
`);

export const metadataQuery: TypedDocumentNode<{
  pack: Pack[];
  cycle: Cycle[];
}> = parse(gql`
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

type QueryCard = Omit<Card, "linked_card_code"> & {
  linked_card: {
    code: string;
  };
};

export const allCardQuery: TypedDocumentNode<{
  all_card: QueryCard[];
}> = parse(gql`
  {
    all_card {
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
      id
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
      real_back_traits
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
      spoiler
      stage
      subtype_code
      # taboo_placeholder
      # taboo_set_id
      tags
      type_code
      updated_at
      vengeance
      version
      victory
      xp
    }
  }
`);
