import type {
  JsonDataCard,
  JsonDataEncounterSet,
  JsonDataPack,
} from "../services/queries.types";

type CustomContentType =
  | "player-cards"
  | "campaign"
  | "scenario"
  | "investigators";

type CustomContentStatus = "final" | "changes-pending" | "abandoned";

type CustomContentProjectConfig = {
  author: string;
  banner_url: string;
  date_updated: string;
  external_link?: string;
  id: string;
  language: string;
  name: string;
  description?: string;
  status: CustomContentStatus;
  tags?: string[];
  types: CustomContentType[];
  version: number;
  url: string;
};

export type CustomContentProject = {
  config: CustomContentProjectConfig;
  cards: JsonDataCard & {
    back_image_url?: string;
    image_url?: string;
    thumbnail_url?: string;
    back_thumbnail_url?: string;
  };
  encounter_sets: JsonDataEncounterSet &
    {
      icon_url?: string;
    }[];
  packs: Omit<JsonDataPack, "cycle_code"> &
    {
      icon_url?: string;
    }[];
};
