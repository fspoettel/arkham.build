import { expect, test } from "@playwright/test";

test("settings (collection)", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("masthead-settings").click();
  await page.getByLabel("The Dunwich Legacy Investigator Expansion").click();
  await page.getByLabel("The Dunwich Legacy Campaign").click();
  await page.getByTestId("settings-save").click();
  await page.getByTestId("settings-back").click();
  await page.getByTestId("search-input").click();
  await page.getByTestId("search-input").fill("yorick");
  await expect(page.getByTestId("cardlist-count")).toContainText("0 cards");
  await page.getByTestId("search-input").dblclick();
  await page.getByTestId("search-input").press("ControlOrMeta+a");
  await page.getByTestId("search-input").fill("zoey");
  await expect(page.getByTestId("cardlist-count")).toContainText("2 cards");

  await page.getByTestId("masthead-settings").click();
  await page.getByTestId("settings-show-all").click();
  await page.getByTestId("settings-save").click();
  await page.getByTestId("settings-back").click();
  await page.getByTestId("search-input").click();
  await page.getByTestId("search-input").fill("yorick");
  await expect(page.getByTestId("cardlist-count")).toContainText("1 cards");
});
