import { expect, test } from "@playwright/test";
import { fillSearch } from "./actions";
import { mockApiCalls } from "./mocks";

test.beforeEach(async ({ page }) => {
  await mockApiCalls(page);
  await page.goto("/");
});

test.describe("filters: interactions", () => {
  test("can filter via shortcuts", async ({ page }) => {
    //await page.getByTestId("filters-faction-multiclass").click();

    await page
      .getByTestId("filters-type-shortcut")
      .getByRole("button", { name: "Event" })
      .click();

    await page
      .getByTestId("filters-level-shortcut")
      .getByRole("radio", { name: "Level 0" })
      .click();

    await page
      .getByTestId("filters-cost")
      .getByTestId("collapsible-trigger")
      .click();

    await page.getByLabel("Minimum").click();
    for (let i = 0; i < 12; i++) {
      await page.getByLabel("Minimum").press("ArrowRight");
    }

    await expect(page.getByTestId("cardlist-count").first()).toContainText(
      "1 cards",
    );
    await expect(page.getByTestId("listcard-60216")).toBeVisible();
  });

  test("can use faction filter", async ({ page }) => {
    await page.getByTestId("filters-faction-seeker").click();

    await fillSearch(page, "Practice Makes Perfect");

    await expect(page.getByTestId("cardlist-count").first()).toContainText(
      "1 cards",
    );
    await expect(page.getByTestId("listcard-06197")).toBeVisible();

    await page.getByTestId("filters-faction-guardian").click();
    await page.getByTestId("filters-faction-seeker").click();

    await expect(page.getByTestId("cardlist-count").first()).toContainText(
      "0 cards",
    );

    await page.getByTestId("filters-faction-seeker").click();
    await expect(page.getByTestId("cardlist-count").first()).toContainText(
      "1 cards",
    );
  });

  test("can use subtype filter", async ({ page }) => {
    await page.getByTestId("search-input").click();
    await fillSearch(page, "king in yellow");
    await expect(page.getByTestId("listcard-03011")).toBeVisible();
    await page.getByTestId("subtype-weakness").click();
    await expect(page.getByTestId("listcard-03011")).not.toBeVisible();
  });

  test("can toggle game text", async ({ page }) => {
    await page.getByTestId("search-input").focus();
    await page.getByTestId("search-game-text").click();
    await fillSearch(page, "ashcan pete");

    await page.getByTestId("search-input").blur();

    await page.locator('[data-test-id="card-list-config"]').click();
    await page.getByLabel("Compact with text").click();

    await expect(page.getByTestId("card-text").first()).toBeVisible();
    await expect(page.getByTestId("card-text").nth(1)).toBeVisible();

    await page.getByLabel("Scans").click();

    await expect(page.getByTestId("card-text").first()).not.toBeVisible();
    await expect(page.getByTestId("card-text").nth(1)).not.toBeVisible();
  });
});
