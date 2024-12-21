import type { ResolvedCard } from "./types";

export class PreviewPublishError extends Error {
  constructor(cards: ResolvedCard[]) {
    const names = cards
      .map(
        (c) =>
          `${c.card.real_name}${c.card.xp != null ? ` (${c.card.xp})` : ""}`,
      )
      .join(", ");

    super(
      `Deck contains preview cards: ${names}. Please remove them before uploading to ArkhamDB`,
    );
  }
}
