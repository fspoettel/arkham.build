import type { ResolvedDeck } from "@/store/lib/types";

export function redirectArkhamDBLinks(evt: React.MouseEvent) {
  evt.preventDefault();
  if (evt.target instanceof HTMLAnchorElement) {
    const href = evt.target.getAttribute("href");
    if (!href) return;

    const url = href.startsWith("/") ? `https://arkhamdb.com${href}` : href;

    window.open(url, "_blank");
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
