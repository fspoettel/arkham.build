import type { Deck } from "../slices/data.types";
import { isDeck } from "../slices/data.types";
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

type FaqResponse = {
  code: string;
  html: string;
  updated: {
    date: string;
  };
}[];

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1${path}`);

  if (res.status >= 400) {
    const err = await res.json();
    throw new Error(err.message);
  }

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

type DeckResponse = {
  data: Deck;
  type: "deck" | "decklist";
};

export async function queryDeck(input: string): Promise<DeckResponse> {
  const res = await request<DeckResponse>(`/deck?q=${input}`);

  if (!isDeck(res.data)) {
    throw new Error("Could not import deck: invalid deck format.");
  }

  return res;
}

export async function queryHistory(code: string | number): Promise<Deck[]> {
  const res = await request<Deck[]>(`/history/${code}`);

  if (!res.every(isDeck)) {
    throw new Error("Could not import history: invalid deck format.");
  }

  return res;
}
