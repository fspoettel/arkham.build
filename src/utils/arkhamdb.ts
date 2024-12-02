import type { ResolvedDeck } from "@/store/lib/types";

export function redirectArkhamDBLinks(evt: React.MouseEvent) {
  evt.preventDefault();
  const target = evt.target as HTMLElement;

  /**
   * If one clicked on bolded anchor or image anchor, need to look for `<a>` on its parent.
   */
  function searchForAnchorParentRecursive(
    node: HTMLElement,
  ): HTMLAnchorElement | null {
    if (node instanceof HTMLAnchorElement) {
      return node;
    }
    if (node.parentElement) {
      return searchForAnchorParentRecursive(node.parentElement);
    }
    return null;
  }

  const anchor = searchForAnchorParentRecursive(target);
  if (anchor !== null) {
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
