import test, { Page, expect } from "@playwright/test";
import { importDeckFromFile } from "./actions";
import { mockApiCalls } from "./mocks";

test.beforeEach(async ({ page }) => {
  await mockApiCalls(page);
});

test.describe("attachments: interactions", () => {
  test("attach a card", async ({ page }) => {
    await page.goto("/deck/create/04001");
    await page.getByTestId("create-save").click();

    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").fill("stick to ");

    await page
      .getByTestId("listcard-03264")
      .getByTestId("quantity-increment")
      .click();

    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").clear();
    await page.getByTestId("search-input").fill("dynam");

    await page
      .getByTestId("listcard-01024")
      .getByTestId("quantity-increment")
      .click();

    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-01024")
      .getByTestId("attachment-03264")
      .click();

    await expect(
      page
        .getByTestId("virtuoso-item-list")
        .getByTestId("listcard-01024")
        .getByTestId("attachment-03264"),
    ).toContainText("×1");
  });

  test("attach a card via the card modal", async ({ page }) => {
    await page.goto("/deck/create/04001");
    await page.getByTestId("create-save").click();

    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").fill("stick to ");

    await page
      .getByTestId("listcard-03264")
      .getByTestId("quantity-increment")
      .click();

    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").clear();
    await page.getByTestId("search-input").fill("dynam");

    await page
      .getByTestId("listcard-01024")
      .getByTestId("listcard-title")
      .click();

    await page
      .getByTestId("card-modal-quantities-main")
      .getByTestId("quantity-increment")
      .click();

    await page
      .getByTestId("card-modal-quantities-03264")
      .getByTestId("quantity-increment")
      .click();
    await page.locator("body").press("Escape");

    await expect(
      page
        .getByTestId("virtuoso-item-list")
        .getByTestId("listcard-01024")
        .getByTestId("attachment-03264"),
    ).toContainText("×1");
  });

  test("attach a card via the attachable card modal", async ({ page }) => {
    await page.goto("/deck/create/04001");
    await page.getByTestId("create-save").click();

    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").fill("stick to ");

    await page
      .getByTestId("listcard-03264")
      .getByTestId("quantity-increment")
      .click();

    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").clear();
    await page.getByTestId("search-input").fill("dynam");

    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-01024")
      .getByTestId("quantity-increment")
      .click();

    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-01024")
      .getByTestId("quantity-increment")
      .click();

    await page
      .getByTestId("listcard-03264")
      .getByTestId("listcard-title")
      .click();

    await page
      .getByTestId("card-03264")
      .getByTestId("quantity-increment")
      .click();

    await page.locator("body").press("Escape");

    await expect(
      page
        .getByTestId("virtuoso-item-list")
        .getByTestId("listcard-01024")
        .getByTestId("attachment-03264"),
    ).toContainText("×1");

    // await expect(
    //   page
    //     .getByTestId("virtuoso-item-list")
    //     .getByTestId("listcard-01024")
    //     .getByTestId("attachment-03264"),
    // ).toContainText("×1");
  });

  test("attach multiple cards", async ({ page }) => {
    await page.goto("/deck/create/04001");
    await page.getByTestId("create-save").click();

    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").fill("underworld");

    await page
      .getByTestId("listcard-09077")
      .getByTestId("quantity-increment")
      .click();

    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").clear();
    await page.getByTestId("search-input").fill("contraband");

    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-02109")
      .getByTestId("quantity-increment")
      .click();

    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-02109")
      .getByTestId("quantity-increment")
      .click();

    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-02109")
      .getByTestId("attachment-09077")
      .click();

    await page
      .getByTestId("virtuoso-item-list")
      .getByTestId("listcard-02109")
      .getByTestId("attachment-09077")
      .click();

    await expect(
      page
        .getByTestId("virtuoso-item-list")
        .getByTestId("listcard-02109")
        .getByTestId("attachment-09077"),
    ).toContainText("×2");
  });
});

test.describe("attachments: display", () => {});
