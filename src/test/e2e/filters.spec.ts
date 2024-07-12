import { expect, test } from "@playwright/test";
import { mockApiCalls } from "./mocks";

test.beforeEach(async ({ page }) => {
  await mockApiCalls(page);
  await page.goto("/");
});

test("faction filter", async ({ page }) => {
  await page.getByTestId("filters-faction").getByTitle("Seeker").click();
  await page.getByTestId("search-input").fill("Practice Makes Perfect");

  await expect(page.getByTestId("cardlist-count")).toContainText("1 cards");
  await expect(page.getByTestId("listcard-06197")).toBeVisible();

  await page.getByTestId("filters-faction").getByTitle("Guardian").click();
  await page.getByTestId("filters-faction").getByTitle("Seeker").click();

  await expect(page.getByTestId("cardlist-count")).toContainText("0 cards");

  await page.getByTestId("filters-faction").getByTitle("Seeker").click();
  await expect(page.getByTestId("cardlist-count")).toContainText("1 cards");
});

test("filter via shortcuts", async ({ page }) => {
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
    .getByTestId("filters-cost")
    .getByTestId("collapsible-trigger")
    .click();

  await page.getByLabel("Maximum").click();
  for (let i = 0; i < 12; i++) {
    await page.getByLabel("Maximum").press("ArrowLeft");
  }

  await expect(page.getByTestId("cardlist-count")).toContainText("1 cards");
  await expect(page.getByTestId("listcard-08087")).toBeVisible();
});

test("subtype filter", async ({ page }) => {
  await page.getByTestId("search-input").click();
  await page.getByTestId("search-input").fill("king in yellow");
  await expect(page.getByTestId("listcard-03011")).toBeVisible();
  await page.getByTestId("subtype-weakness").click();
  await expect(page.getByTestId("listcard-03011")).not.toBeVisible();
});
