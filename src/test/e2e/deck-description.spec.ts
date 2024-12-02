import { expect, test } from "@playwright/test";
import { importDeckFromFile } from "./actions";
import { mockApiCalls } from "./mocks";

test.beforeEach(async ({ page }) => {
  await mockApiCalls(page);
  await page.goto("/");
});

test.describe("deck description", () => {
  test("redirect card links to arkham.build", async ({ page }) => {
    await importDeckFromFile(page, "./deck_description.json", {
      navigate: "view",
    });
    await page.getByTestId("tab-notes").click();

    await page.getByRole("link", { name: "Colt" }).first().click();
    await expect(page.getByTestId("card-face")).toBeVisible();

    const nextPagePromise = page.waitForEvent("popup");
    await page.getByRole("link", { name: "Colt" }).first().click();
    const nextPage = await nextPagePromise;

    const url = new URL(nextPage.url());
    expect(url.pathname).toEqual("/card/03020");
    expect(new URL(page.url()).origin).toEqual(url.origin);
  });

  test("redirect FAQ links to arkhamdb", async ({ page }) => {
    await importDeckFromFile(page, "./deck_description.json", {
      navigate: "view",
    });
    await page.getByTestId("tab-notes").click();

    const nextPagePromise = page.waitForEvent("popup");
    await page.getByRole("link", { name: "ruling" }).click();
    const nextPage = await nextPagePromise;

    const nextPageOrigin = new URL(nextPage.url()).origin;
    expect(nextPageOrigin).toEqual("https://arkhamdb.com");
  });

  test("redirect other relative links to arkhamdb", async ({ page }) => {
    await importDeckFromFile(page, "./deck_description.json", {
      navigate: "view",
    });
    await page.getByTestId("tab-notes").click();

    const nextPagePromise = page.waitForEvent("popup");
    await page.getByRole("link", { name: "decklist" }).click();
    const nextPage = await nextPagePromise;

    const nextPageOrigin = new URL(nextPage.url()).origin;
    expect(nextPageOrigin).toEqual("https://arkhamdb.com");
  });

  test("redirect card links with nested content flow content", async ({
    page,
  }) => {
    await importDeckFromFile(page, "./deck_description.json", {
      navigate: "view",
    });
    await page.getByTestId("tab-notes").click();

    await page.getByRole("link", { name: "True Grit" }).first().click();
    await expect(
      page.getByTestId("card-tooltip").getByTestId("card-03021"),
    ).toBeVisible();

    const nextPagePromise = page.waitForEvent("popup");
    await page.getByRole("link", { name: "True Grit" }).first().click();
    const nextPage = await nextPagePromise;

    const url = new URL(nextPage.url());
    expect(url.pathname).toEqual("/card/03021");
    expect(new URL(page.url()).origin).toEqual(url.origin);
  });

  test("redirect card links with nested block content", async ({ page }) => {
    await importDeckFromFile(page, "./deck_description.json", {
      navigate: "view",
    });
    await page.getByTestId("tab-notes").click();
    await page
      .getByTestId("description-content")
      .getByRole("link", { name: "card" })
      .click();

    const nextPagePromise = page.waitForEvent("popup");
    await page
      .getByTestId("description-content")
      .getByRole("link", { name: "card" })
      .click();
    const nextPage = await nextPagePromise;
    const url = new URL(nextPage.url());
    expect(url.pathname).toEqual("/card/03022");
    expect(new URL(page.url()).origin).toEqual(url.origin);
  });
});
