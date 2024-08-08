import type { Deck } from "../slices/data.types";
import { isDeck } from "../slices/data.types";
import cards from "./data/cards.json";
import factions from "./data/factions.json";
import packs from "./data/packs.json";
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

async function request(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/v1${path}`, options);

  if (res.status >= 400) {
    const err = await res.json();
    throw new Error(err.message);
  }

  return res;
}

export async function queryMetadata(): Promise<MetadataResponse> {
  const res = await request("/cache/metadata");
  const { data }: MetadataApiResponse = await res.json();

  return {
    ...data,
    pack: [...data.pack, ...packs],
    reprint_pack: reprintPacks,
    faction: factions,
    type: types,
    subtype: subTypes,
  };
}

export async function queryDataVersion() {
  const res = await request("/cache/version");
  const { data }: DataVersionApiResponse = await res.json();
  return data.all_card_updated[0];
}

export async function queryCards(): Promise<QueryCard[]> {
  const res = await request("/cache/cards");
  const { data }: AllCardApiResponse = await res.json();
  return [...data.all_card, ...cards];
}

export async function queryFaq(clientId: string, code: string) {
  const res = await request(`/public/faq/${code}`, {
    headers: {
      "X-Client-Id": clientId,
    },
  });
  const data: FaqResponse = await res.json();
  return data;
}

type DeckResponse = {
  data: Deck;
  type: "deck" | "decklist";
};

export async function importDeck(clientId: string, input: string) {
  const res = await request(`/public/import?q=${encodeURIComponent(input)}`, {
    headers: {
      "X-Client-Id": clientId,
    },
    method: "POST",
  });

  const data: DeckResponse = await res.json();

  if (!isDeck(data.data)) {
    throw new Error("Could not import deck: invalid deck format.");
  }

  return data;
}

export async function getShare(id: string) {
  const res = await request(`/public/share/${id}`);
  const data: Deck = await res.json();
  return data;
}

export async function createShare(clientId: string, deck: Deck) {
  await request("/public/share", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Client-Id": clientId,
    },
    body: JSON.stringify(deck),
  });
}

export async function updateShare(clientId: string, id: string, deck: Deck) {
  await request(`/public/share/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Client-Id": clientId,
    },
    body: JSON.stringify(deck),
  });
}

export async function deleteShare(clientId: string, id: string) {
  await request(`/public/share/${id}`, {
    method: "DELETE",
    headers: {
      "X-Client-Id": clientId,
    },
  });
}
