import { expect, test } from "@playwright/test";
import { mockApiCalls } from "./mocks";

test("settings: collection", async ({ page }) => {
  await mockApiCalls(page);
  await page.goto("/");
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^OwnershipAll$/ })
      .first(),
  ).toBeVisible();

  await page.getByTestId("masthead-settings").click();
  await page.getByTestId("settings-show-all").click();

  await page.getByLabel("The Dunwich Legacy Investigator Expansion").click();
  await page.getByLabel("The Dunwich Legacy Campaign").click();
  await page.getByTestId("settings-save").click();
  await page.getByTestId("settings-back").click();

  await page.getByTestId("search-input").click();
  await page.getByTestId("search-input").fill("zoey");
  await expect(page.getByTestId("cardlist-count")).toContainText("2 cards");

  await page.getByTestId("search-input").click();
  await page.getByTestId("search-input").fill("yorick");
  await expect(page.getByTestId("cardlist-count")).toContainText("0 cards");

  await expect(
    page
      .locator("div")
      .filter({ hasText: /^OwnershipOwned$/ })
      .first(),
  ).toBeVisible();

  await page.getByTestId("masthead-settings").click();
  await page.getByTestId("settings-show-all").click();
  await page.getByTestId("settings-save").click();
  await page.getByTestId("settings-back").click();
  await page.getByTestId("search-input").click();
  await page.getByTestId("search-input").fill("yorick");
  await expect(page.getByTestId("cardlist-count")).toContainText("1 cards");

  await expect(
    page
      .locator("div")
      .filter({ hasText: /^OwnershipAll$/ })
      .first(),
  ).toBeVisible();
});

test("settings: taboo", async ({ page }) => {
  await mockApiCalls(page);
  await page.goto("/");

  await page.getByTestId("search-game-text").click();
  await page.getByTestId("search-input").fill("Mutated");
  await expect(page.getByTestId("cardlist-count")).toContainText("0 cards");
  await page.getByTestId("masthead-settings").click();
  await page.getByTestId("settings-taboo-set").selectOption("7");
  await page.getByTestId("settings-save").click();
  await page.getByTestId("settings-back").click();
  await expect(page.getByRole("button", { name: "Rex Murphy" })).toBeVisible();
  await page.getByRole("button", { name: "Rex Murphy" }).click();
  await expect(page.getByTestId("card-text").first()).toContainText(
    "Mutated. After you succeed at a skill test by 2 or more while investigating: Discover 1 clue at your location. (Limit once per round.)",
  );
  await expect(page.getByTestId("card-taboo").first()).toContainText(
    "Taboo List Mutated",
  );
});
