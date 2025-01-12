import test, { type Page, expect } from "@playwright/test";
import { fillSearch, importDeckFromFile } from "./actions";
import { mockApiCalls } from "./mocks";

test.beforeEach(async ({ page }) => {
  await mockApiCalls(page);
});

async function sumCardCounts(page: Page) {
  const elements = await page
    .getByTestId("editor-tabs-slots")
    .getByTestId("quantity-value")
    .all();

  let sum = 0;

  for (const el of elements) {
    const text = await el.innerText();
    sum += Number.parseInt(text, 10);
  }

  return sum;
}

test.describe("deck edit", () => {
  test("draw random basic weakness", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("collection-create-deck").click();

    await fillSearch(page, "subject");

    await page
      .getByTestId("listcard-89001")
      .getByTestId("create-choose-investigator")
      .click();

    await page.getByTestId("create-save").click();

    await expect(page.getByTestId("editor-tabs-slots")).toBeVisible();

    await expect(
      page.getByTestId("listcard-01000").getByTestId("quantity-value"),
    ).toContainText("2");

    expect(await sumCardCounts(page)).toEqual(9);

    await page.getByTestId("draw-basic-weakness").click();

    await expect(
      page.getByTestId("listcard-01000").getByTestId("quantity-value"),
    ).toContainText("1");

    expect(await sumCardCounts(page)).toEqual(9);

    await page.getByTestId("draw-basic-weakness").click();

    await expect(
      page.getByTestId("listcard-01000").getByTestId("quantity-value"),
    ).toContainText("0");

    expect(await sumCardCounts(page)).toEqual(9);
  });

  test("customizable deck limits (honed instinct)", async ({ page }) => {
    await importDeckFromFile(page, "validation/honed_instinct_valid.json", {
      navigate: "edit",
    });

    await expect(page.getByTestId("decklist-validation")).not.toBeVisible();

    // open honed instinct card modal.
    await page
      .getByTestId("listcard-09061")
      .getByTestId("listcard-title")
      .click();

    // deselect last xp and close modal. (deck_limit 3 => 2)
    await page.getByTestId("customization-6-xp-2").click();
    await page.getByTestId("card-modal").press("Escape");

    await expect(page.getByTestId("decklist-validation")).toBeVisible();

    // decrement honed instinct quantity.
    await page
      .getByTestId("listcard-09061")
      .getByTestId("quantity-decrement")
      .click();

    // increment a one-off to get back to 30 cards.
    await page
      .getByTestId("listcard-01086")
      .getByTestId("quantity-increment")
      .click();

    await expect(page.getByTestId("decklist-validation")).not.toBeVisible();
  });

  test("move to main deck", async ({ page }) => {
    await importDeckFromFile(page, "validation/honed_instinct_valid.json", {
      navigate: "edit",
    });

    await expect(
      page.getByTestId("editor-tabs-slots").getByTestId("listcard-02229"),
    ).not.toBeVisible();

    await page.getByTestId("editor-tab-sideslots").click();

    await fillSearch(page, "quick thinking");

    await page
      .getByTestId("listcard-02229")
      .getByTestId("quantity-increment")
      .click();
    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-02229")
      .getByTestId("quantity-increment")
      .dblclick();
    await page.getByTestId("editor-move-to-main").click();
    await page.getByTestId("editor-move-to-main").click();

    await page.getByTestId("editor-tab-slots").click();
    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-02229")
        .getByTestId("quantity-value"),
    ).toContainText("2");
  });

  test("transformed investigators", async ({ page }) => {
    await importDeckFromFile(page, "ythian.json", {
      navigate: "edit",
    });

    await fillSearch(page, "flashlight");
    await expect(page.getByTestId("cardlist-count").first()).toContainText(
      "0 cards",
    );

    await fillSearch(page, "maimed hand");
    await expect(page.getByTestId("cardlist-count").first()).toContainText(
      "1 cards",
    );

    await expect(
      page.getByTestId("listcard-01087").getByTestId("quantity-value"),
    ).toBeVisible();

    await expect(
      page.getByTestId("listcard-01087").getByTestId("quantity-increment"),
    ).not.toBeVisible();

    await expect(
      page.getByTestId("listcard-02039").getByTestId("quantity-increment"),
    ).toBeVisible();
  });

  test("add campaign card", async ({ page }) => {
    await importDeckFromFile(page, "validation/honed_instinct_valid.json", {
      navigate: "edit",
    });
    await page.getByTestId("card-type-encounter").click();
    await page
      .getByTestId("listcard-01117")
      .getByTestId("quantity-increment")
      .click();
    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-01117")
        .getByTestId("quantity-value"),
    ).toContainText("1");
  });

  test("add advanced signature", async ({ page }) => {
    await importDeckFromFile(page, "validation/honed_instinct_valid.json", {
      navigate: "edit",
    });

    await page.getByTestId("search-input").focus();

    await page.getByTestId("search-game-text").click();
    await fillSearch(page, "Advanced.");

    await page
      .getByTestId("listcard-90009")
      .getByTestId("quantity-increment")
      .click();

    await page
      .getByTestId("listcard-90010")
      .getByTestId("quantity-increment")
      .click();

    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-90010")
        .getByTestId("quantity-value"),
    ).toContainText("1");

    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-90009")
        .getByTestId("quantity-value"),
    ).toContainText("1");
  });

  test("signature -> signature relation", async ({ page }) => {
    await importDeckFromFile(page, "validation/honed_instinct_valid.json", {
      navigate: "edit",
    });

    await page
      .getByTestId("listcard-01010")
      .getByTestId("listcard-title")
      .click();

    await expect(
      page.getByTestId("cardset-otherSignatures").getByTestId("listcard-90009"),
    ).toBeVisible();

    await page
      .getByTestId("cardset-otherSignatures")
      .getByTestId("listcard-90009")
      .getByTestId("listcard-title")
      .click();

    await expect(
      page.getByTestId("cardset-otherSignatures").getByTestId("listcard-01010"),
    ).toBeVisible();
  });

  test("display duplicates in deck (revised core)", async ({ page }) => {
    await importDeckFromFile(page, "revised_core.json", {
      navigate: "edit",
    });

    await fillSearch(page, "deduction");

    await expect(
      page
        .getByTestId("virtuoso-item-list")
        .getByTestId("listcard-60219")
        .getByTestId("quantity-value"),
    ).toContainText("2");

    await expect(
      page
        .getByTestId("virtuoso-item-list")
        .getByTestId("listcard-01039")
        .getByTestId("quantity-value"),
    ).toContainText("2");

    await expect(
      page
        .getByTestId("virtuoso-item-list")
        .getByTestId("listcard-01539")
        .getByTestId("quantity-value"),
    ).toContainText("2");

    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-60219")
        .getByTestId("quantity-value"),
    ).toContainText("2");

    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-01039")
        .getByTestId("quantity-value"),
    ).toContainText("2");

    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-01539")
        .getByTestId("quantity-value"),
    ).toContainText("2");

    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-01539")
      .getByTestId("quantity-decrement")
      .click();

    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-01539")
      .getByTestId("quantity-decrement")
      .click();

    await page.getByTestId("editor-save").click();
    await page.getByTestId("view-edit").click();

    await fillSearch(page, "deduction");

    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-60219")
        .getByTestId("quantity-value"),
    ).toContainText("2");

    await expect(
      page
        .getByTestId("editor-tabs-slots")
        .getByTestId("listcard-01039")
        .getByTestId("quantity-value"),
    ).toContainText("2");

    await expect(
      page
        .getByTestId("virtuoso-item-list")
        .getByTestId("listcard-01539")
        .getByTestId("quantity-value"),
    ).not.toBeVisible();
  });

  test("change taboo set (default none)", async ({ page }) => {
    await page.goto("/deck/create/01001");
    await page.getByTestId("create-save").click();
    await fillSearch(page, "runic axe");

    await page
      .getByTestId("listcard-09022")
      .getByTestId("quantity-increment")
      .click();

    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("quantity-increment")
      .click();

    await page
      .getByTestId("editor-tabs-slots")
      .getByTestId("listcard-09022")
      .getByTestId("listcard-title")
      .click();
    await expect(page.getByTestId("customization-3-xp-1")).not.toBeVisible();

    await page.getByTestId("card-modal").press("Escape");

    await page.getByTestId("editor-tab-meta").click();

    await page.getByTestId("meta-taboo-set").selectOption("8");

    await page
      .getByTestId("listcard-09022")
      .getByTestId("listcard-title")
      .click();

    await expect(page.getByTestId("customization-3-xp-1")).toBeVisible();
  });

  test("change taboo set (default set)", async ({ page }) => {
    await page.goto("/settings");
    await page.getByTestId("settings-taboo-set").selectOption("8");
    await page.getByTestId("settings-save").click();

    await page.goto("/deck/create/01001");
    await page.getByTestId("create-save").click();
    await fillSearch(page, "runic axe");

    await page
      .getByTestId("listcard-09022")
      .getByTestId("quantity-increment")
      .click();

    await page
      .getByTestId("editor-tabs-slots")
      .getByTestId("listcard-09022")
      .getByTestId("listcard-title")
      .click();

    await expect(page.getByTestId("customization-3-xp-1")).toBeVisible();

    await page.getByTestId("card-modal").press("Escape");

    await page.getByTestId("editor-tab-meta").click();

    await page.getByTestId("meta-taboo-set").selectOption("8");

    await page.getByTestId("meta-taboo-set").selectOption("");

    await page
      .getByTestId("listcard-09022")
      .getByTestId("listcard-title")
      .click();

    await expect(page.getByTestId("customization-3-xp-1")).not.toBeVisible();
  });

  test("customizable selections", async ({ page }) => {
    await page.goto("/deck/create/03006");
    await page.getByTestId("create-save").click();

    await fillSearch(page, "Raven Quill");
    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-09042")
      .getByTestId("quantity-increment")
      .click();
    await page
      .getByTestId("editor-tabs-slots")
      .getByTestId("listcard-09042")
      .getByTestId("listcard-title")
      .click();
    await page.getByTestId("combobox-input").click();
    await page.getByTestId("combobox-input").fill("grim memoir");
    await page.getByTestId("listcard-09044").click();
    await page.getByTestId("combobox-input").press("Escape");
    await page.locator("body").press("Escape");

    await fillSearch(page, "honed instinct");
    await page
      .getByTestId("listcard-09061")
      .getByTestId("quantity-increment")
      .dblclick();
    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-09061")
      .getByTestId("listcard-title")
      .click();
    await page.getByTestId("customization-6-xp-2").click();
    await page
      .getByTestId("card-modal-quantities-main")
      .getByTestId("quantity-increment")
      .click();
    await page.locator("body").press("Escape");

    await fillSearch(page, "grizzled");
    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-09101")
      .getByTestId("quantity-increment")
      .click();
    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-09101")
      .getByTestId("listcard-title")
      .click();
    await page.getByTestId("combobox-input").click();
    await page.getByTestId("combobox-input").fill("monster");
    await page.getByTestId("combobox-menu-item-Monster").click();
    await page.getByTestId("combobox-input").press("Escape");
    await page.locator("body").press("Escape");

    await fillSearch(page, "friends in low places");
    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-09060")
      .getByTestId("listcard-title")
      .click();
    await page.getByTestId("combobox-input").click();
    await page.getByTestId("combobox-input").fill("item");
    await page.getByTestId("combobox-menu-item-Item").click();
    await page.getByTestId("combobox-input").press("Escape");
    await page.locator("body").press("Escape");

    await fillSearch(page, "summoned servitor");
    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-09080")
      .getByTestId("quantity-increment")
      .click();
    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-09080")
      .getByTestId("listcard-title")
      .click();
    await page.getByTestId("customization-5-xp-1").click();
    await page.getByTestId("customization-remove-slot").selectOption("1");
    await page.getByTestId("customization-remove-slot").press("Escape");
    await page.locator("body").press("Escape");

    await fillSearch(page, "living ink");
    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-09079")
      .getByTestId("quantity-increment")
      .click();
    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-09079")
      .getByTestId("listcard-title")
      .click();
    await page.getByTestId("combobox-input").click();
    await page.getByTestId("combobox-menu-item-intellect").click();
    await page.getByTestId("combobox-input").press("Escape");
    await page.locator("body").press("Escape");

    await page.getByTestId("editor-save").click();
  });
});
