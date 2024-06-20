import { expect, test } from "@playwright/test";

test("deck import", async ({ page }) => {
  await page.goto("http://localhost:3000/");

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
});
