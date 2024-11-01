import test, { type Page, expect } from "@playwright/test";
import {
  importDeck,
  importDeckFromFile,
  shareDeck,
  waitForImagesLoaded,
} from "./actions";
import { mockApiCalls } from "./mocks";

test.beforeEach(async ({ page }) => {
  await mockApiCalls(page);
});

async function importStandardDeck(page: Page) {
  await importDeck(page);

  const deckNode = page.getByTestId("collection-deck");
  await deckNode.click();
  await expect(page).toHaveURL(/\/deck\/view/);
}

test.describe("deck view: display", () => {
  test("renders deck metadata", async ({ page }) => {
    await importStandardDeck(page);

    await expect(page.getByTestId("view-deck-xp")).toContainText(
      "XP required31",
    );
    await expect(page.getByTestId("view-deck-taboo")).toContainText("Taboo2.1");
    await expect(page.getByTestId("deck-tags")).toBeVisible();

    await expect(page.getByTestId("view-deck-size")).toContainText(
      "Deck size30 (37 total)",
    );

    await expect(page.getByTestId("view-title")).toContainText(
      "Kōhaku, Fifty Shades of Blurse|FHV Intro|Deck Guide",
    );
  });

  test("renders deck card list", async ({ page }) => {
    await importStandardDeck(page);

    await expect(page.getByTestId("view-decklist")).toBeVisible();
    await waitForImagesLoaded(page);

    await page.evaluate(() => {
      [
        document.querySelector("[data-testid=toast]"),
        document.querySelector("[data-testid=view-notes-toggle]"),
      ].forEach((el) => {
        if (el instanceof HTMLElement) el.style.visibility = "hidden";
      });
    });

    await expect(page.getByTestId("view-decklist")).toHaveScreenshot();
  });

  test("renders deck investigator", async ({ page }) => {
    await importStandardDeck(page);
    await expect(page.getByTestId("deck-investigator-front")).toBeVisible();
  });

  test("renders bonded cards in relations", async ({ page }) => {
    await importDeckFromFile(page, "bonded.json", {
      navigate: "view",
    });

    await expect(
      page.getByTestId("listcard-06113").getByTestId("quantity-value"),
    ).toHaveText("1");

    await expect(
      page.getByTestId("listcard-05314").getByTestId("quantity-value"),
    ).toHaveText("3");

    await expect(
      page.getByTestId("listcard-05314").getByTestId("quantity-value"),
    ).toHaveText("3");

    await page
      .getByTestId("listcard-05314")
      .getByTestId("listcard-title")
      .click();

    await expect(
      page.getByTestId("card-modal-quantities-main"),
    ).not.toBeVisible();

    await expect(
      page
        .getByTestId("card-modal-quantities-bonded")
        .getByTestId("quantity-value"),
    ).toHaveText("3");
  });

  test("renders ignore_deck_limit_slots markers", async ({ page }) => {
    await importDeckFromFile(page, "validation/parallel_agnes.json", {
      navigate: "view",
    });

    await expect(
      page.getByTestId("listcard-10102").getByTestId("quantity-value"),
    ).toHaveText("2");

    await expect(
      page.getByTestId("listcard-06201").getByTestId("quantity-value"),
    ).toHaveText("2");

    await expect(
      page.getByTestId("listcard-06201").getByTestId("listcard-ignored"),
    ).toBeVisible();

    await page
      .getByTestId("listcard-06201")
      .getByTestId("listcard-title")
      .click();

    await expect(page.getByTestId("card-modal-quantities-main")).toHaveText(
      "2",
    );

    await expect(
      page
        .getByTestId("card-modal-quantities-ignored")
        .getByTestId("quantity-value"),
    ).toHaveText("2");
  });

  test("renders forbidden cards", async ({ page }) => {
    await importDeckFromFile(page, "bonded.json", {
      navigate: "view",
    });

    await expect(page.getByTestId("listcard-54002")).toHaveClass(/forbidden/);
  });

  test("renders customizable cards with options", async ({ page }) => {
    await importDeckFromFile(page, "validation/access_customizable.json", {
      navigate: "view",
    });

    await page.getByTestId("listcard-09040").click();

    await expect(
      page.getByTestId("card-modal").getByTestId("card-text"),
    ).toHaveText(/Heal 2 horror./);
    await expect(
      page.getByTestId("card-modal").getByTestId("card-text"),
    ).not.toHaveText(/Heal 2 damage./);

    await expect(page.getByTestId("customizations-editor")).toBeVisible();

    await expect(page.getByTestId("customization-0-xp-0")).not.toBeChecked();
    await expect(page.getByTestId("customization-1-xp-0")).toBeChecked();

    await page.getByTestId("card-modal").press("Escape");

    await page.getByTestId("listcard-09021").click();

    const cardHealth = page
      .getByTestId("card-modal")
      .getByTestId("card-health");

    await expect(cardHealth.getByTestId("health")).toHaveAttribute(
      "data-value",
      "4",
    );
    await expect(cardHealth.getByTestId("sanity")).toHaveAttribute(
      "data-value",
      "2",
    );
  });

  test("renders parallel investigators", async ({ page }) => {
    await importDeckFromFile(page, "validation/parallel_wendy.json", {
      navigate: "view",
    });

    await page.getByTestId("deck-investigator-back-toggle").click();

    await expect(
      page.getByTestId("deck-investigator-front").getByTestId("card-text"),
    ).toHaveText(/Add Tidal Memento/);

    await expect(
      page.getByTestId("deck-investigator-back").getByTestId("card-text"),
    ).toHaveText(/choose both and gain/);
  });

  test("renders transformed investigators", async ({ page }) => {
    await importDeckFromFile(page, "ythian.json", {
      navigate: "view",
    });

    await expect(page.getByTestId("card-name")).toContainText(
      "Body of a Yithian",
    );

    await expect(
      page.getByTestId("listcard-01087").getByTestId("quantity-value"),
    ).toBeVisible();

    await expect(
      page.getByTestId("listcard-01087").getByTestId("quantity-increment"),
    ).not.toBeVisible();
  });

  test("renders option_select selections", async ({ page }) => {
    await importDeckFromFile(page, "validation/parallel_wendy.json", {
      navigate: "view",
    });

    await page.getByTestId("deck-investigator-back-toggle").click();

    await expect(
      page.getByTestId("selection-option_selected-label"),
    ).toHaveText("Option Selected");

    await expect(
      page.getByTestId("selection-option_selected-value"),
    ).toHaveText("Blessed and Cursed");
  });
});

test.describe("deck view: interactions", () => {
  test("can show deck notes", async ({ page }) => {
    await importStandardDeck(page);

    await page.getByTestId("view-notes-toggle").click();
    await expect(page.getByTestId("view-notes-modal")).toBeVisible();

    await page.keyboard.down("Escape");
    await expect(page.getByTestId("view-notes-modal")).not.toBeVisible();
  });

  test("can show deck investigator back", async ({ page }) => {
    await importStandardDeck(page);

    await expect(page.getByTestId("deck-investigator-back")).not.toBeVisible();
    await page.getByTestId("deck-investigator-back-toggle").click();
    await expect(page.getByTestId("deck-investigator-back")).toBeVisible();
  });

  test("can edit deck", async ({ page }) => {
    await importStandardDeck(page);

    await page.getByTestId("view-edit").click();
    await expect(page).toHaveURL(/\/deck\/edit/);
  });

  test("can delete deck", async ({ page }) => {
    await importStandardDeck(page);

    page.on("dialog", (dialog) => dialog.accept());
    await page.getByTestId("view-more-actions").click();
    await page.getByTestId("view-delete").click();

    await expect(page).toHaveURL(/\//);
    await expect(page.getByTestId("collection-deck")).not.toBeVisible();
    await expect(page.getByText("Collection empty")).toBeVisible();
  });

  test("can duplicate deck", async ({ page }) => {
    await importStandardDeck(page);

    await page.getByTestId("view-more-actions").click();
    await page.getByTestId("view-duplicate").click();
    await expect(page.getByTestId("view-title")).toContainText("(Copy)");

    // TODO: why does `page.goto("/")` show a spinner? maybe we have a race condition with init logic.
    await page.getByTestId("masthead-logo").click();
    expect(await page.getByTestId("collection-deck").all()).toHaveLength(2);
  });

  test("can export as json", async ({ page }) => {
    await importStandardDeck(page);

    const downloadPromise = page.waitForEvent("download");

    await page.getByTestId("view-more-actions").click();
    await page.getByTestId("view-export-json").click();

    const download = await downloadPromise;

    const fail = await download.failure();
    expect(fail).toBe(null);
  });

  test("can export as markdown", async ({ page }) => {
    await importStandardDeck(page);

    const downloadPromise = page.waitForEvent("download");

    await page.getByTestId("view-more-actions").click();
    await page.getByTestId("view-export-text").click();

    const download = await downloadPromise;

    const fail = await download.failure();
    expect(fail).toBe(null);
  });

  test("can share deck", async ({ page }) => {
    await shareDeck(page);

    await expect(page.getByTestId("view-title")).toContainText(
      "Kōhaku, Fifty Shades of Blurse|FHV Intro|Deck Guide",
    );

    await expect(page.getByTestId("view-deck-size")).toContainText(
      "Deck size30 (37 total)",
    );

    await expect(page.getByTestId("view-deck-xp")).toContainText(
      "XP required31",
    );

    await expect(page.getByTestId("view-deck-taboo")).toContainText("Taboo2.1");

    await expect(page.getByTestId("deck-tags")).toBeVisible();
  });

  test("can show shared deck list", async ({ page }) => {
    await shareDeck(page);

    await expect(page.getByTestId("view-decklist")).toBeVisible();
    await waitForImagesLoaded(page);

    await page.evaluate(() => {
      [
        document.querySelector("[data-testid=toast]"),
        document.querySelector("[data-testid=view-notes-toggle]"),
      ].forEach((el) => {
        if (el instanceof HTMLElement) el.style.visibility = "hidden";
      });
    });

    await expect(page.getByTestId("view-decklist")).toHaveScreenshot();
  });
});
