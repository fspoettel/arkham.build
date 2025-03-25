import type {
  JsonDataCard,
  JsonDataEncounterSet,
  JsonDataPack,
} from "../services/queries.types";

type ContentType = "player-cards" | "campaign" | "scenario" | "investigators";

type ProjectStatus = "final" | "changes-pending" | "abandoned";

type ProjectMeta = {
  /** Author of the project. */
  author: string;
  /** URL to a banner image, aspect ratio 16:9. */
  banner_url?: string;
  /** Unique identifier (UUIDv4) for the project. */
  code: string;
  /** Date when this content was last updated, as ISO 8601 datestamp. */
  date_updated: string;
  /** Detailed description for the project. Markdown is supported. */
  description?: string;
  /** External project link. */
  external_link?: string;
  /** Language of the project as ISO 639-1 language code. */
  language: string;
  /** Name of the project. */
  name: string;
  /** Project status. If not specified, project is assumed to be "final". */
  status?: ProjectStatus;
  /** List of tags for the project. Tags should be english. */
  tags?: string[];
  /** List of content types that the project contains. */
  types: ContentType[];
  /** URL to where the project (=this file) is hosted. Used to fetch updates. Null for local packs. */
  url?: string | null;
};

type CustomContentCard = JsonDataCard & {
  /** URL to back image, if a back present. Ideally 750x1050. */
  back_image_url?: string;
  /** URL to back thumbnail, if a back present. 1:1 aspect ratio. */
  back_thumbnail_url?: string;
  /** URL to image. Ideally 750x1050. */
  image_url?: string;
  /** URL to thumbnail. 1:1 aspect ratio. */
  thumbnail_url?: string;
};

type CustomContentEncounterSet = JsonDataEncounterSet & {
  /** Url to SVG icon for encounter set. */
  icon_url?: string;
};

// `A cycle will be created from the metadata, so no cycle_code needs to be provided.`
type CustomContentPack = Omit<JsonDataPack, "cycle_code"> & {
  /** Url to SVG icon pack. */
  icon_url?: string;
};

export type CustomContentProject = {
  meta: ProjectMeta;
  data: {
    cards: CustomContentCard[];
    encounter_sets: CustomContentEncounterSet[];
    packs: CustomContentPack[];
  };
};
