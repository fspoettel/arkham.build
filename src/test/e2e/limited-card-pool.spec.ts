import path from "node:path";
import test, { Page, expect } from "@playwright/test";
import { fillSearch } from "./actions";
import { mockApiCalls } from "./mocks";

test.beforeEach(async ({ page }) => {
  await mockApiCalls(page);
});

async function createLimitedPoolDeck(page: Page) {
  await page.goto("deck/create/01001");

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
    await fillSearch(page, "machete");
    await expect(page.getByTestId("listcard-01020")).toBeVisible();
    await page.getByTestId("search").getByRole("button").click();
    await fillSearch(page, "runic axe");
    await expect(page.getByTestId("listcard-09022")).not.toBeVisible();
  });

  test("edit card pool in deck editor", async ({ page }) => {
    await createLimitedPoolDeck(page);

    await fillSearch(page, "runic axe");
    await expect(page.getByTestId("listcard-09022")).not.toBeVisible();

    await page.getByTestId("editor-tab-meta").click();

    await page.getByTestId("combobox-input").click();
    await page.getByTestId("combobox-input").fill("scarlet");
    await page.getByTestId("combobox-menu-item-tskp").click();
    await expect(page.getByTestId("listcard-09022")).toBeVisible();
  });

  test("remove card pool in deck editor", async ({ page }) => {
    await createLimitedPoolDeck(page);

    await fillSearch(page, "runic axe");
    await expect(page.getByTestId("listcard-09022")).not.toBeVisible();

    await page.getByTestId("editor-tab-meta").click();
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

  test("does not show preview cards in limited pool mode", async ({ page }) => {
    await page.goto("/settings");
    await page.getByTestId("tab-collection").click();
    await page.getByTestId("settings-show-previews").click();
    await page.getByTestId("settings-save").click();
    await page.getByTestId("masthead-logo").click();
    await createLimitedPoolDeck(page);
    await fillSearch(page, "crowbar");
    await expect(page.getByTestId("cardlist-count")).toContainText("0 cards");
    await page.getByTestId("editor-tab-meta").click();
    await page.getByTestId("combobox-input").click();
    await page.getByTestId("combobox-input").fill("drown");
    await page.getByTestId("combobox-menu-item-tdcp").click();
    await expect(page.getByTestId("listcard-11021")).toBeVisible();
  });
});

test.describe("sealed deck", () => {
  test("can create sealed deck", async ({ page }) => {
    await page.goto("/deck/create/01001");
    await uploadSealedDeck(page);
    await page.getByTestId("create-save").click();
    await fillSearch(page, "art student");
    await expect(page.getByTestId("listcard-02149")).toBeVisible();
    await fillSearch(page, "runic axe");
    await expect(page.getByTestId("listcard-09022")).not.toBeVisible();
  });

  test("can undo sealed deck", async ({ page }) => {
    await page.goto("/deck/create/01001");
    await uploadSealedDeck(page);
    await page.getByTestId("sealed-deck-remove").click();
    await page.getByTestId("create-save").click();
    await fillSearch(page, "art student");
    await expect(page.getByTestId("listcard-02149")).toBeVisible();
    await fillSearch(page, "runic axe");
    await expect(page.getByTestId("listcard-09022")).toBeVisible();
  });

  test("can remove sealed deck", async ({ page }) => {
    await page.goto("/deck/create/01001");
    await uploadSealedDeck(page);
    await page.getByTestId("create-save").click();
    await page.getByTestId("editor-tab-meta").click();
    await page.getByTestId("sealed-deck-remove").click();
    await fillSearch(page, "art student");
    await expect(page.getByTestId("listcard-02149")).toBeVisible();
    await fillSearch(page, "runic axe");
    await expect(page.getByTestId("listcard-09022")).toBeVisible();
  });

  test("applies sealed deck quantities", async ({ page }) => {
    await page.goto("/deck/create/01001");
    await uploadSealedDeck(page);
    await page.getByTestId("create-save").click();
    await page
      .getByTestId("listcard-01020")
      .getByTestId("quantity-increment")
      .click();

    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-01020")
      .getByTestId("quantity-increment")
      .click();

    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-01020")
        .getByTestId("quantity-value"),
    ).toContainText("2");

    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-02149")
      .getByTestId("quantity-increment")
      .click();

    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-02149")
        .getByTestId("quantity-value"),
    ).toContainText("1");

    expect(
      page
        .getByTestId("virtuoso-item-list")
        .getByTestId("listcard-02149")
        .getByTestId("quantity-increment"),
    ).toBeDisabled();

    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-02149")
        .getByTestId("quantity-increment"),
    ).toBeDisabled();

    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-02149")
      .getByTestId("listcard-title")
      .click();

    await expect(
      page
        .getByTestId("card-modal-quantities-main")
        .getByTestId("quantity-increment"),
    ).toBeDisabled();

    await page.getByTestId("card-modal").press("Escape");

    await page.getByTestId("editor-tab-sideslots").click();
    await page
      .getByTestId("listcard-02149")
      .getByTestId("quantity-increment")
      .click();
    await page.getByTestId("editor-move-to-main").click();
    await page.getByTestId("editor-tab-slots").click();

    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-02149")
        .getByTestId("quantity-value"),
    ).toContainText("1");
  });
});

async function uploadSealedDeck(page: Page) {
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
