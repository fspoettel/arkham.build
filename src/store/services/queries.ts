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

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1${path}`);
  return await res.json();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function stub<T>(path: string): Promise<T> {
  return import(/* @vite-ignore */ path).then((p) => p.default as T);
}

type MetadataApiResponseType = Omit<
  MetadataResponse,
  "faction" | "reprint_pack" | "type" | "subtype"
>;

export async function queryMetadata() {
  // const data = await stub<MetadataApiResponseType>("./data/stubs/metadata.json")
  const { data }: { data: MetadataApiResponseType } =
    await request("/metadata");
  return {
    ...data,
    reprint_pack: reprintPacks,
    faction: factions,
    type: types,
    subtype: subTypes,
  };
}

export async function queryDataVersion() {
  // const data = await stub("./data/stubs/data_version.json");
  const { data } = await request<{ data: DataVersionResponse }>("/version");
  return data.all_card_updated[0];
}

export async function queryCards() {
  // const data = await stub<AllCardResponse>("./data/stubs/all_card.json")
  const { data } = await request<{ data: AllCardResponse }>("/cards");
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
  return request(`/faq/${code}`);
}
