import { expect, test } from "@playwright/test";
import { mockApi } from "./http-mocks";

test("filters (shortcuts)", async ({ page }) => {
  await mockApi(page);
  await page.goto("/");

  await page.getByTestId("filters-faction").getByTitle("Multiclass").click();
  await page
    .getByTestId("filters-type-shortcut")
    .getByRole("button", { name: "Event" })
    .click();
  await page
    .getByTestId("filters-level-shortcut")
    .getByRole("radio", { name: "Level 1-5" })
    .click();

  await page
    .locator("div")
    .filter({ hasText: /^CostAll$/ })
    .nth(1)
    .click();

  await page.getByLabel("Maximum").click();

  for (let i = 0; i < 12; i++) {
    await page.getByLabel("Maximum").press("ArrowLeft");
  }

  await expect(page.getByTestId("cardlist-count")).toContainText("1 cards");

  await expect(
    page.getByRole("figure").locator("div").filter({ hasText: "Snipe" }),
  ).toBeVisible();
});
