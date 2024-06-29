import test, { expect } from "@playwright/test";
import { importDeck, waitForImagesLoaded } from "./actions";
import { mockApiCalls } from "./mocks";

test.beforeEach(async ({ page }) => {
  await mockApiCalls(page);
  await importDeck(page);
  const deckNode = page.getByTestId("collection-deck");
  await deckNode.click();
  await expect(page).toHaveURL(/\/deck\/view/);
});

test("show deck view", async ({ page }) => {
  await expect(page.getByTestId("view-title")).toContainText(
    "Kōhaku, Fifty Shades of Blurse|FHV Intro|Deck Guide",
  );

  await expect(page.getByTestId("view-deck-size")).toContainText(
    "Deck size30 (37 total)",
  );

  await expect(page.getByTestId("view-deck-xp")).toContainText("XP required31");

  await expect(page.getByTestId("view-deck-taboo")).toContainText(
    "Taboo2.1 - 2023",
  );

  await expect(page.getByTestId("deck-tags")).toBeVisible();
});

test("toggle deck notes", async ({ page }) => {
  await page.getByTestId("view-notes-toggle").click();
  await expect(page.getByTestId("view-notes-modal")).toBeVisible();
  await page.keyboard.down("Escape");
  await expect(page.getByTestId("view-notes-modal")).not.toBeVisible();
});

test("show deck list", async ({ page }) => {
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

test("show deck investigator", async ({ page }) => {
  await expect(page.getByTestId("deck-investigator-front")).toBeVisible();
  await expect(page.getByTestId("deck-investigator-back")).not.toBeVisible();

  await page.getByTestId("deck-investigator-back-toggle").click();
  await expect(page.getByTestId("deck-investigator-back")).toBeVisible();
});

test("edit deck", async ({ page }) => {
  await page.getByTestId("view-edit").click();
  await expect(page).toHaveURL(/\/deck\/edit/);
});

test("delete deck", async ({ page }) => {
  page.on("dialog", (dialog) => dialog.accept());
  await page.getByTestId("view-delete").click();
  await expect(page).toHaveURL(/\//);
  await expect(page.getByTestId("collection-deck")).not.toBeVisible();
  await expect(page.getByText("Collection empty")).toBeVisible();
});
