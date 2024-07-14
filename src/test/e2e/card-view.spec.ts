import { Page, expect, test } from "@playwright/test";
import { mockApiCalls } from "./mocks";

test.beforeEach(async ({ page }) => {
  await mockApiCalls(page);
});

async function cardVisible(page: Page, code: string, section?: string) {
  const locator = section ? page.getByTestId(section) : page;
  const el = locator.getByTestId(`card-${code}`);
  await el.scrollIntoViewIfNeeded();
  await expect(el).toBeVisible();
}

test("renders cards and relations", async ({ page }) => {
  await page.goto("/card/01001");

  await cardVisible(page, "01001");

  await cardVisible(page, "90024", "parallel");

  await cardVisible(page, "01006", "required");
  await cardVisible(page, "01007", "required");

  await cardVisible(page, "90030", "advanced");
  await cardVisible(page, "90031", "advanced");

  await cardVisible(page, "90025", "parallel-cards");
  await cardVisible(page, "90026", "parallel-cards");
  await cardVisible(page, "90027", "parallel-cards");
  await cardVisible(page, "90028", "parallel-cards");
  await cardVisible(page, "90029", "parallel-cards");

  await cardVisible(page, "98005", "replacement");
  await cardVisible(page, "98006", "replacement");
});

test("links related cards", async ({ page }) => {
  await page.goto("/card/01001");
  await page.getByTestId("card-98005").getByTestId("card-name").click();

  await cardVisible(page, "98005");
  await cardVisible(page, "01001", "restricted-to");
});

test("links player card relations", async ({ page }) => {
  await page.goto("/card/06112");
  await cardVisible(page, "06112");
  await cardVisible(page, "06113", "bound");
  await cardVisible(page, "06236", "level");
  await cardVisible(page, "06237", "level");
  await cardVisible(page, "06238", "level");

  await page.goto("/card/06113");
  await cardVisible(page, "06112", "bonded");

  await page.goto("/card/06238");
  await cardVisible(page, "06113", "bound");
  await cardVisible(page, "06112", "level");
  await cardVisible(page, "06236", "level");
  await cardVisible(page, "06237", "level");
});

test("links player cards to investigators", async ({ page }) => {
  await page.goto("/card/06238");
  await page.getByTestId("usable-by").getByTestId("details-toggle").click();
  await expect(page.getByTestId("listcard-07002")).toBeVisible();
  await expect(page.getByTestId("listcard-01001")).not.toBeVisible();
});

test("links cards usable by investigator", async ({ page }) => {
  await page.goto("http://localhost:3000/card/01001");
  await page.getByTestId("usable-cards").click();
  await expect(
    page.getByRole("heading", { name: "Cards usable by" }),
  ).toBeVisible();
  await page.getByTestId("search-input").click();

  await page.getByTestId("search-input").fill("deduc");
  await expect(page.getByTestId("listcard-01039")).toBeVisible();
  await expect(page.getByTestId("listcard-02150")).toBeVisible();

  await page.getByTestId("search-input").fill("followed");
  await expect(page.getByTestId("listcard-06114")).not.toBeVisible();
});

test("links cards usable by parallel investigator", async ({ page }) => {
  await page.goto("http://localhost:3000/card/01001");
  await page.getByTestId("usable-cards-parallel").click();

  await expect(
    page.getByRole("heading", { name: "Cards usable by" }),
  ).toBeVisible();

  await page.getByTestId("search-input").click();

  await page.getByTestId("search-input").fill("deduc");
  await expect(page.getByTestId("listcard-01039")).not.toBeVisible();
  await expect(page.getByTestId("listcard-02150")).not.toBeVisible();

  await page.getByTestId("search-input").fill("followed");
  await expect(page.getByTestId("listcard-06114")).toBeVisible();
});
