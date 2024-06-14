import { request } from "graphql-request";
import { allCardQuery, dataVersionQuery, metadataQuery } from "./queries";
import factions from "@/data/factions.json";
import subtypes from "@/data/subtypes.json";
import types from "@/data/types.json";
import { Writeable, indexedByCode } from "../../utils";
import { Card } from "../schema";

const graphqlUrl = import.meta.env.VITE_GRAPHQL_DATA_ENDPOINT;

export async function queryMetadata() {
  const data = await request(graphqlUrl, metadataQuery);

  return {
    cycles: indexedByCode(data.cycle),
    factions: indexedByCode(factions),
    packs: indexedByCode(data.pack),
    subtypes: indexedByCode(subtypes),
    types: indexedByCode(types),
  };
}

export async function queryDataVersion() {
  const data = await request(graphqlUrl, dataVersionQuery);
  return data.all_card_updated[0];
}

export async function queryCards() {
  const data = await request(graphqlUrl, allCardQuery);

  const cards = data.all_card.reduce(
    (acc, curr) => {
      const card = curr as unknown as Card;
      (card as Writeable<Card>).linked_card_code = curr.linked_card?.code;
      acc[card.code] = card;
      return acc;
    },
    {} as Record<string, Card>,
  );

  return cards;
}
