import path from "node:path";
import test, { Page, expect } from "@playwright/test";
import { mockApiCalls } from "./mocks";

test.beforeEach(async ({ page }) => {
  await mockApiCalls(page);
});

async function createLimitedPoolDeck(page: Page) {
  await page.goto("deck/create/01001");

  await page.getByTestId("collapsible-trigger").getByRole("button").click();

  await page
    .getByTestId("limited-card-pool-field")
    .getByTestId("combobox-input")
    .click();

  await page
    .getByTestId("virtuoso-item-list")
    .getByText("Revised Core Set")
    .click();
  await page.getByText("The Forgotten Age").click();
  await page.getByTestId("combobox-input").press("Escape");
  await page.getByTestId("create-save").click();
  await expect(page.getByTestId("limited-card-pool-tag")).toBeVisible();
}

test.describe("limited card pool", () => {
  test("setup card pool in deck create", async ({ page }) => {
    await createLimitedPoolDeck(page);
  });

  test("display card pool in deck editor", async ({ page }) => {
    await createLimitedPoolDeck(page);
    await expect(page.getByTestId("limited-card-pool-tag")).toBeVisible();
  });

  test("apply card pool in deck editor", async ({ page }) => {
    await createLimitedPoolDeck(page);
    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").fill("machete");
    await expect(page.getByTestId("listcard-01020")).toBeVisible();
    await page.getByTestId("search").getByRole("button").click();
    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").fill("runic axe");
    await expect(page.getByTestId("listcard-09022")).not.toBeVisible();
  });

  test("edit card pool in deck editor", async ({ page }) => {
    await createLimitedPoolDeck(page);

    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").fill("runic axe");
    await expect(page.getByTestId("listcard-09022")).not.toBeVisible();

    await page.getByTestId("editor-tab-meta").click();

    await page
      .getByTestId("meta-limited-card-pool")
      .getByTestId("collapsible-trigger")
      .click();
    await page.getByTestId("combobox-input").click();
    await page.getByTestId("combobox-input").fill("scarlet");
    await page.getByTestId("combobox-menu-item-tskp").click();
    await expect(page.getByTestId("listcard-09022")).toBeVisible();
  });

  test("remove card pool in deck editor", async ({ page }) => {
    await createLimitedPoolDeck(page);

    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").fill("runic axe");
    await expect(page.getByTestId("listcard-09022")).not.toBeVisible();

    await page.getByTestId("editor-tab-meta").click();
    await page
      .getByTestId("meta-limited-card-pool")
      .getByTestId("collapsible-trigger")
      .click();
    await page
      .getByTestId("combobox-result-tfap")
      .getByTestId("combobox-result-remove")
      .click();
    await page.getByTestId("combobox-result-remove").click();
    await expect(page.getByTestId("listcard-09022")).toBeVisible();
  });

  test("display card pool in deck view", async ({ page }) => {
    await createLimitedPoolDeck(page);
    await page.getByTestId("editor-save").click();
    await expect(page.getByTestId("limited-card-pool-tag")).toBeVisible();
  });

  test("can create sealed deck", async ({ page }) => {
    await page.goto("/deck/create/01001");
    await uploadSealedDeck(page);
    await page.getByTestId("create-save").click();
    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").fill("art stu");
    await expect(page.getByTestId("listcard-02149")).toBeVisible();
    await page.getByTestId("search-input").fill("runic");
    await expect(page.getByTestId("listcard-09022")).not.toBeVisible();
  });

  test("can undo sealed deck", async ({ page }) => {
    await page.goto("/deck/create/01001");
    await uploadSealedDeck(page);
    await page.getByTestId("sealed-deck-remove").click();
    await page.getByTestId("create-save").click();
    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").fill("art stu");
    await expect(page.getByTestId("listcard-02149")).toBeVisible();
    await page.getByTestId("search-input").fill("runic");
    await expect(page.getByTestId("listcard-09022")).toBeVisible();
  });

  test("can remove sealed deck", async ({ page }) => {
    await page.goto("/deck/create/01001");
    await uploadSealedDeck(page);
    await page.getByTestId("create-save").click();
    await page.getByTestId("editor-tab-meta").click();
    await page
      .getByTestId("meta-limited-card-pool")
      .getByTestId("collapsible-trigger")
      .click();
    await page.getByTestId("sealed-deck-remove").click();
    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").fill("art stu");
    await expect(page.getByTestId("listcard-02149")).toBeVisible();
    await page.getByTestId("search-input").fill("runic");
    await expect(page.getByTestId("listcard-09022")).toBeVisible();
  });
});

async function uploadSealedDeck(page: Page) {
  await page.getByTestId("collapsible-trigger").getByRole("button").click();

  const fileChooserPromise = page.waitForEvent("filechooser");

  await page.getByTestId("sealed-deck-button").click();

  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles([
    path.join(
      process.cwd(),
      "src/test/fixtures/stubs/sealed_deck_definition.csv",
    ),
  ]);
}
