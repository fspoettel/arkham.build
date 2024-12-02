import type { ResolvedDeck } from "@/store/lib/types";

export function redirectArkhamDBLinks(evt: React.MouseEvent) {
  evt.preventDefault();

  if (evt.target instanceof HTMLElement) {
    const anchor = evt.target?.closest("a") as HTMLAnchorElement;

    if (anchor != null) {
      const href = anchor.getAttribute("href");
      if (!href) return;

      let url: string;
      if (href.startsWith("/card")) {
        url = href;
      } else if (href.startsWith("/")) {
        url = `https://arkhamdb.com${href}`;
      } else {
        url = href;
      }

      window.open(url, "_blank");
    }
  }
}

export function assertCanPublishDeck(deck: ResolvedDeck) {
  const previews = Object.values({
    ...deck.cards.slots,
    ...deck.cards.extraSlots,
    investigatorBack: deck.investigatorBack,
    investigatorFront: deck.investigatorFront,
  }).filter((c) => c.card.preview);

  if (previews.length) {
    const names = previews
      .map(
        (c) =>
          `${c.card.real_name}${c.card.xp != null ? ` (${c.card.xp})` : ""}`,
      )
      .join(", ");
    throw new Error(
      `Deck contains preview cards: ${names}. Please remove them before uploading to ArkhamDB`,
    );
  }
}
