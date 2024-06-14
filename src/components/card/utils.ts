export function parseCardTextHtml(cardText: string) {
  return cardText
    .replaceAll("\n", "<br>")
    .replaceAll(/\[\[(.*?)\]\]/g, "<b><em>$1</em></b>")
    .replaceAll(/\[((?:\w|_)+?)\]/g, `<i class="icon-text icon-$1"></i>`);
}

export function parseCustomizationTextHtml(customizationText: string) {
  return parseCardTextHtml(customizationText);
}
