export function parseCardTextHtml(cardText: string) {
  let html = cardText;
  html = html.replaceAll("\n", "<br>");
  html = html.replaceAll(/\[\[(.*?)\]\]/g, "<b><em>$1</em></b>");
  html = html.replaceAll(/\[(.*?)\]/g, `<i class="icon-text icon-$1"></i>`);
  return html;
}
