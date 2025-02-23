import { PreviewPublishError } from "@/store/lib/errors";
import type { ResolvedDeck } from "@/store/lib/types";
import i18n from "./i18n";

export function localizeArkhamDBBaseUrl() {
  const lng = i18n.language;

  const baseUrl = new URL(import.meta.env.VITE_ARKHAMDB_BASE_URL);
  if (lng === "en") return baseUrl.origin;

  baseUrl.hostname = `${lng}.${baseUrl.hostname}`;
  return baseUrl.origin;
}

export function redirectArkhamDBLinks(evt: React.MouseEvent) {
  evt.preventDefault();

  if (evt.target instanceof HTMLElement) {
    const anchor = evt.target?.closest("a") as HTMLAnchorElement;

    if (anchor != null) {
      const href = anchor.getAttribute("href");
      if (!href) return;

      let url: string;
      if (href.startsWith("/card") && !href.includes("#review-")) {
        url = href;
      } else if (href.startsWith("/")) {
        const baseUrl = localizeArkhamDBBaseUrl();
        url = `${baseUrl}${href}`;
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
    throw new PreviewPublishError(previews);
  }
}
