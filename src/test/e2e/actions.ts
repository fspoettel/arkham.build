import { type Locator, type Page, expect } from "@playwright/test";

export async function importDeck(page: Page) {
  await page.goto("/");

  await page.getByTestId("import-trigger").click();
  await page.getByTestId("import-input").click();

  await page
    .getByTestId("import-input")
    .fill(
      "https://arkhamdb.com/decklist/view/47001/khaku-fifty-shades-of-blurse-fhv-intro-deck-guide-1.0",
    );

  await page.getByTestId("import-submit").click();
}

export function locateCardInSlots(locator: Page | Locator, code: string) {
  return locator
    .getByTestId("editor-tabs-slots")
    .getByTestId(`listcard-${code}`);
}

export async function waitForImagesLoaded(locator: Page | Locator) {
  for (const image of await locator.locator("img").all()) {
    const src = await image.getAttribute("src");
    if (src && !src.includes("svg")) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty("complete", true);
      await expect(image).not.toHaveJSProperty("naturalWidth", 0);
    }
  }
}
