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

export function canPublishDeck(deck: ResolvedDeck) {
  const hasPreviews = Object.values({
    ...deck.cards.slots,
    ...deck.cards.extraSlots,
    investigatorBack: deck.investigatorBack.card,
    investigatorFront: deck.investigatorFront.card,
  }).some((c) => c.preview);

  return !hasPreviews;
}
