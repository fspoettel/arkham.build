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
} from "./queries.types";

export type MetadataApiResponse = {
  data: Omit<MetadataResponse, "faction" | "reprint_pack" | "type" | "subtype">;
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

export type DataVersionApiResponse = {
  data: {
    all_card_updated: DataVersion[];
  };
};

export type DataVersionResponse = DataVersion;

export type AllCardApiResponse = {
  data: {
    all_card: QueryCard[];
  };
};

export type AllCardResponse = QueryCard[];

export type FaqResponse = {
  code: string;
  html: string;
  updated: {
    date: string;
  };
}[];

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1${path}`);
  return await res.json();
}

export async function queryMetadata(): Promise<MetadataResponse> {
  const res = await request<MetadataApiResponse>("/metadata");
  return {
    ...res.data,
    reprint_pack: reprintPacks,
    faction: factions,
    type: types,
    subtype: subTypes,
  };
}

export async function queryDataVersion(): Promise<DataVersionResponse> {
  const { data } = await request<DataVersionApiResponse>("/version");
  return data.all_card_updated[0];
}

export async function queryCards(): Promise<AllCardResponse> {
  const { data } = await request<AllCardApiResponse>("/cards");
  return data.all_card;
}

export async function queryFaq(code: string): Promise<FaqResponse> {
  return request(`/faq/${code}`);
}
