import type { Metadata } from "../slices/metadata.types";

import localCards from "@/store/services/data/cards.json";
import localCycles from "@/store/services/data/cycles.json";
import localPacks from "@/store/services/data/packs.json";
import { formatLocalCard } from "@/utils/card-utils";

export function applyLocalData(_metadata: Metadata) {
  const metadata = {
    ..._metadata,
    cards: {
      ..._metadata.cards,
    },
    cycles: {
      ..._metadata.cycles,
    },
    packs: {
      ..._metadata.packs,
    },
  };

  for (const card of localCards) {
    metadata.cards[card.code] = formatLocalCard(card);
  }

  for (const pack of localPacks) {
    metadata.packs[pack.code] = pack;
  }

  for (const cycle of localCycles) {
    metadata.cycles[cycle.code] = cycle;
  }

  return metadata;
}
