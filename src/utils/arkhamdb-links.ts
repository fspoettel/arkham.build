export function redirectArkhamDBLinks(evt: React.MouseEvent) {
  evt.preventDefault();
  if (evt.target instanceof HTMLAnchorElement) {
    const href = evt.target.getAttribute("href");
    if (!href) return;

    const url = href.startsWith("/") ? `https://arkhamdb.com${href}` : href;

    window.open(url, "_blank");
  }
}
