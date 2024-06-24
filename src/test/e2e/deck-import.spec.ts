import { expect, test } from "@playwright/test";
import { mockApi } from "./http-mocks";

test("deck import", async ({ page }) => {
  await mockApi(page);
  await page.goto("/");

  await page.getByTestId("import-trigger").click();
  await page.getByTestId("import-input").click();
  await page
    .getByTestId("import-input")
    .fill(
      "https://arkhamdb.com/decklist/view/47001/khaku-fifty-shades-of-blurse-fhv-intro-deck-guide-1.0",
    );
  await page.getByTestId("import-submit").click();

  await expect(
    page
      .getByTestId("collection-deck")
      .first()
      .getByTestId("deck-investigator"),
  ).toContainText("Kōhaku Narukami");

  await expect(
    page.getByTestId("collection-deck").first().getByTestId("deck-title"),
  ).toContainText("Kōhaku, Fifty Shades of Blurse|FHV Intro|Deck Guide");
});
