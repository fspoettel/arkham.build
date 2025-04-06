// TODO: validate that each encounter set belongs to only one pack.

import { FACTION_ORDER, PLAYER_TYPE_ORDER } from "@/utils/constants";
import * as v from "valibot";

const UrlSchema = v.pipe(v.string(), v.url());

const ContentTypeSchema = v.picklist([
  "player_cards",
  "campaign",
  "scenario",
  "investigators",
]);

const StatusSchema = v.picklist(["final", "changes_pending", "abandoned"]);

const FactionSchema = v.picklist(FACTION_ORDER);
const CardTypeSchema = v.picklist(PLAYER_TYPE_ORDER);
const SubtypeSchema = v.picklist(["basicweakness", "weakness"]);

const ProjectMetaSchema = v.object({
  /** Author of the project. */
  author: v.string(),
  /** URL to a banner image, dimensions: 1180x500. */
  banner_url: v.optional(v.string()),
  /** Unique identifier (UUIDv4) for the project. */
  code: v.pipe(v.string(), v.minLength(3)),
  /** Date when this content was last updated, as ISO 8601 datestamp. */
  date_updated: v.optional(v.string()),
  /** Detailed description for the project. Markdown is supported. */
  description: v.optional(v.string()),
  /** External project link. */
  external_link: v.optional(v.union([UrlSchema, v.literal("")])),
  /** Language of the project as ISO 639-1 language code. */
  language: v.string(),
  /** Name of the project. */
  name: v.string(),
  /** Project status. If not specified, project is assumed to be "final". */
  status: v.optional(StatusSchema),
  /** List of tags for the project. Tags should be english. */
  tags: v.optional(v.array(v.string())),
  /** List of content types that the project contains. */
  types: v.optional(v.array(ContentTypeSchema)),
  /** URL to where the project (=this file) is hosted. Used to fetch updates. Null for local packs. */
  url: v.optional(UrlSchema),
});

const CustomContentEncounterSetSchema = v.object({
  code: v.string(),
  name: v.string(),
  icon_url: v.optional(UrlSchema),
});

const CustomContentPackSchema = v.object({
  code: v.string(),
  icon_url: v.optional(UrlSchema),
  name: v.string(),
  position: v.optional(v.number()),
});

const CustomContentCardSchema = v.object({
  back_flavor: v.optional(v.string()),
  back_illustrator: v.optional(v.string()),
  back_image_url: v.optional(UrlSchema),
  back_link: v.optional(v.string()),
  back_name: v.optional(v.string()),
  back_text: v.optional(v.string()),
  back_thumbnail_url: v.optional(UrlSchema),
  back_traits: v.optional(v.string()),
  bonded_count: v.optional(v.number()),
  bonded_to: v.optional(v.string()),
  clues: v.optional(v.nullable(v.number())),
  clues_fixed: v.optional(v.boolean()),
  code: v.string(),
  cost: v.optional(v.nullable(v.number())),
  // not supported right now. TODO: review if the logic is generic enough.
  // customization_change: v.optional(v.string()),
  // customization_options: v.optional(v.array(v.looseObject({}))),
  // customization_text: v.optional(v.string()),
  deck_requirements: v.optional(v.nullable(v.string())),
  deck_options: v.optional(v.nullable(v.array(v.looseObject({})))),
  deck_limit: v.optional(v.number()),
  doom: v.optional(v.nullable(v.number())),
  double_sided: v.optional(v.boolean()),
  encounter_code: v.optional(v.string()),
  encounter_position: v.optional(v.number()),
  enemy_damage: v.optional(v.number()),
  enemy_evade: v.optional(v.nullable(v.number())),
  enemy_fight: v.optional(v.nullable(v.number())),
  enemy_horror: v.optional(v.number()),
  exceptional: v.optional(v.boolean()),
  exile: v.optional(v.boolean()),
  faction_code: FactionSchema,
  faction2_code: v.optional(FactionSchema),
  faction3_code: v.optional(FactionSchema),
  flavor: v.optional(v.string()),
  health: v.optional(v.nullable(v.number())),
  health_per_investigator: v.optional(v.boolean()),
  hidden: v.optional(v.boolean()),
  illustrator: v.optional(v.string()),
  image_url: v.optional(UrlSchema),
  is_unique: v.optional(v.boolean()),
  myriad: v.optional(v.boolean()),
  name: v.string(),
  pack_code: v.string(),
  permanent: v.optional(v.boolean()),
  position: v.number(),
  quantity: v.number(),
  restrictions: v.optional(v.string()),
  sanity: v.optional(v.number()),
  shroud: v.optional(v.nullable(v.number())),
  // not supported right now. TODO: review if the logic is generic enough.
  // side_deck_options: v.optional(v.array(v.looseObject({}))),
  // side_deck_requirements: v.optional(v.string()),
  skill_agility: v.optional(v.number()),
  skill_combat: v.optional(v.number()),
  skill_intellect: v.optional(v.number()),
  skill_willpower: v.optional(v.number()),
  skill_wild: v.optional(v.number()),
  slot: v.optional(v.string()),
  stage: v.optional(v.number()),
  subname: v.optional(v.string()),
  subtype_code: v.optional(SubtypeSchema),
  tags: v.optional(v.string()),
  text: v.optional(v.string()),
  thumbnail_url: v.optional(UrlSchema),
  traits: v.optional(v.string()),
  type_code: CardTypeSchema,
  vengeance: v.optional(v.number()),
  victory: v.optional(v.number()),
  xp: v.optional(v.number()),
});

export const CustomContentProjectSchema = v.object({
  meta: ProjectMetaSchema,
  data: v.object({
    cards: v.array(CustomContentCardSchema),
    encounter_sets: v.array(CustomContentEncounterSetSchema),
    packs: v.array(CustomContentPackSchema),
  }),
});

export type CustomContentProject = v.InferInput<
  typeof CustomContentProjectSchema
>;

export type CustomContentCard = v.InferInput<typeof CustomContentCardSchema>;
