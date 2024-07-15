import path from "node:path";
import { expect, test } from "@playwright/test";
import { importDeck } from "./actions";
import { mockApiCalls } from "./mocks";

test.beforeEach(async ({ page }) => {
  await mockApiCalls(page);
  await importDeck(page);
});

test("create a deck", async ({ page }) => {
  await page.getByTestId("collection-create-deck").click();
  await expect(page).toHaveURL(/\/deck\/create/);
});

test("import a deck", async ({ page }) => {
  const deckNode = page.getByTestId("collection-deck");
  await expect(deckNode).toBeVisible();
  expect(await deckNode.count()).toBe(1);
});

test("display deck summary", async ({ page }) => {
  const deckNode = page.getByTestId("collection-deck");

  await Promise.all([
    expect(deckNode.getByTestId("deck-summary-investigator")).toContainText(
      "Kōhaku Narukami",
    ),
    expect(deckNode.getByTestId("deck-summary-title")).toContainText(
      "Kōhaku, Fifty Shades of Blurse|FHV Intro|Deck Guide",
    ),
    expect(deckNode.getByTestId("deck-summary-xp")).toContainText("31 XP"),
    expect(deckNode.getByTestId("deck-summary-size")).toContainText("30 (37)"),
    expect(deckNode.getByTestId("deck-tags")).toContainText(
      "SoloMultiplayerThemeBeginner",
    ),
  ]);
});

test("deck summary links to deck view", async ({ page }) => {
  const deckNode = page.getByTestId("collection-deck");
  await deckNode.click();
  await expect(page).toHaveURL(/\/deck\/view/);
});

test("import decks via files", async ({ page }) => {
  const fileChooserPromise = page.waitForEvent("filechooser");

  await page.getByTestId("collection-more-actions").click();
  await page.getByTestId("collection-import-file").click();

  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles([
    path.join(process.cwd(), "src/test/fixtures/decks/extra_slots.json"),
    path.join(process.cwd(), "src/test/fixtures/decks/faction_select.json"),
  ]);

  await expect(page.getByTestId("collection-deck")).toHaveCount(3);
});

test("import delete decks", async ({ page }) => {
  page.on("dialog", (dialog) => dialog.accept());

  await page.getByTestId("collection-more-actions").click();
  await page.getByTestId("collection-delete-all").click();

  await expect(page.getByText("Collection empty")).toBeVisible();
  await expect(page.getByTestId("collection-deck")).not.toBeVisible();
});
