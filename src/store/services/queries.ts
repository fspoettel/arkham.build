import type { Deck, Id } from "../slices/data.types";
import { isDeck } from "../slices/data.types";
import cards from "./data/cards.json";
import encounterSets from "./data/encounter_sets.json";
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

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/v1${path}`, options);

  if (res.status >= 400) {
    const err = await res.json();
    throw new ApiError(err.message, res.status);
  }

  return res;
}

/**
 * Cache API
 */

export async function queryMetadata(): Promise<MetadataResponse> {
  const res = await request("/cache/metadata");
  const { data }: MetadataApiResponse = await res.json();

  return {
    ...data,
    card_encounter_set: [...data.card_encounter_set, ...encounterSets],
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

/**
 * Public API
 */

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

/**
 * Authenticated API
 */

export async function getSession() {
  const res = await request("/user/session", {
    credentials: "include",
  });
  const data = await res.json();
  return data;
}

type DecksResponse = {
  data: Deck[];
  lastModified: string | undefined;
};

export async function getDecks(
  lastSyncedDate?: string,
): Promise<DecksResponse | undefined> {
  const headers = lastSyncedDate
    ? {
        "If-Modified-Since": lastSyncedDate,
      }
    : undefined;

  const res = await request("/user/decks", {
    credentials: "include",
    headers,
  });

  return res.status === 304
    ? undefined
    : {
        data: await res.json(),
        lastModified: res.headers.get("Last-Modified")?.toString(),
      };
}

export async function newDeck(deck: Deck): Promise<Deck> {
  const res = await request("/user/decks", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      investigator: deck.investigator_code,
      name: deck.name,
      slots: JSON.stringify(deck.slots),
      taboo: deck.taboo_id,
      meta: deck.meta,
    }),
    credentials: "include",
    method: "POST",
  });

  return await res.json();
}

export async function updateDeck(deck: Deck): Promise<Deck> {
  const res = await request(`/user/decks/${deck.id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deck),
    credentials: "include",
    method: "PUT",
  });

  return await res.json();
}

export async function deleteDeck(id: Id, allVersions?: boolean) {
  const path = `/user/decks/${id}`;

  await request(allVersions ? `${path}?all=true` : path, {
    body: allVersions ? JSON.stringify({ all: true }) : undefined,
    method: "DELETE",
    credentials: "include",
  });
}

export async function upgradeDeck(
  id: Id,
  payload: {
    xp: number;
    exiles?: string;
    meta?: string;
  },
) {
  const res = await request(`/user/decks/${id}/upgrade`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    method: "POST",
    credentials: "include",
  });

  return await res.json();
}
