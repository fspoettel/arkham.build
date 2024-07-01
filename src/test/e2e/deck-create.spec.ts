import { Locator, Page, expect, test } from "@playwright/test";
import { locateCardInSlots } from "./actions";
import { mockApiCalls } from "./mocks";

test.beforeEach(async ({ page }) => {
  await mockApiCalls(page);
});

function locateSignatureQuantity(page: Page, code: string) {
  return page
    .getByTestId("cardset-requiredCards")
    .getByTestId(`listcard-${code}`)
    .getByTestId("quantity-value");
}

test("choose investigator", async ({ page }) => {
  await page.goto("/deck/create");

  await page.getByTestId("search-input").click();
  await page.getByTestId("search-input").fill("jenny barnes");
  await expect(page.getByTestId("cardlist-count")).toContainText("1 cards");

  await page.getByTestId("create-choose-investigator").click();
  await expect(page).toHaveURL(/\/deck\/create\/02003/);
});

test("choose investigator via modal", async ({ page }) => {
  await page.goto("/deck/create");

  await page.getByTestId("search-input").click();
  await page.getByTestId("search-input").fill("jenny barnes");
  await expect(page.getByTestId("cardlist-count")).toContainText("1 cards");

  await page.getByTestId("cardlist-item-title").click();
  await expect(page.getByTestId("card-modal")).toBeVisible();
  await page.getByTestId("card-modal-create-deck").click();

  await expect(page).toHaveURL(/\/deck\/create\/02003/);
});

const JENNY_SIGNATURES = ["02010", "02011"];

const JENNY_ALTERNATE_SIGNATURES = ["98002", "98003"];

test("select investigator", async ({ page }) => {
  await page.goto("/deck/create/02003");
  await page.getByTestId("create-title").fill("Jenny Test");
  await page.getByTestId("create-save").click();

  await expect(page).toHaveURL(/\/deck\/edit/);

  await expect(page.getByTestId("deck-summary-investigator")).toContainText(
    "Jenny Barnes",
  );

  await expect(page.getByTestId("editor-tabs-slots")).toBeVisible();

  for (const code of JENNY_SIGNATURES) {
    await expect(locateCardInSlots(page, code)).toBeVisible();
  }

  for (const code of JENNY_ALTERNATE_SIGNATURES) {
    await expect(locateCardInSlots(page, code)).not.toBeVisible();
  }
});

test("select alternate signatures", async ({ page }) => {
  await page.goto("/deck/create/02003");

  await page.getByText("Replacements").click();
  await page.getByLabel("Signatures").click();

  await page.getByTestId("create-save").click();

  await expect(page.getByTestId("editor-tabs-slots")).toBeVisible();

  for (const code of JENNY_SIGNATURES) {
    await expect(locateCardInSlots(page, code)).not.toBeVisible();
  }

  for (const code of JENNY_ALTERNATE_SIGNATURES) {
    await expect(locateCardInSlots(page, code)).toBeVisible();
  }
});

test("select a faction", async ({ page }) => {
  await page.goto("/deck/create/06003");
  await page
    .getByTestId("create-select-faction_selected")
    .selectOption("seeker");
  await page.getByTestId("create-save").click();

  await page
    .getByTestId("filters-type-shortcut")
    .getByRole("button", { name: "Event" })
    .click();

  await page.getByTestId("filters-faction-seeker").click();
  await expect(page.getByTestId("cardlist-count")).toContainText("47 cards");

  await page.getByTestId("filters-faction-seeker").click();
  await page.getByTestId("filters-faction-survivor").click();
  await expect(page.getByTestId("cardlist-count")).toContainText("1 cards");
});

test("select deck size (mandy)", async ({ page }) => {
  await page.goto("/deck/create/06002");
  await page.getByTestId("create-select-deck_size_selected").selectOption("40");

  await expect(locateSignatureQuantity(page, "06008")).toContainText("2");

  await page.getByTestId("create-save").click();

  await expect(page.getByTestId("editor-tabs-slots")).toBeVisible();

  await expect(
    locateCardInSlots(page, "06008").getByTestId("quantity-value"),
  ).toContainText("2");
});

test("select deck size (mandy taboo)", async ({ page }) => {
  await page.goto("/deck/create/06002");
  await page.getByTestId("create-select-deck_size_selected").selectOption("40");

  await expect(locateSignatureQuantity(page, "06008")).toContainText("2");

  await page.getByTestId("create-taboo").selectOption("7");
  await expect(locateSignatureQuantity(page, "06008")).toContainText("3");

  await page.getByTestId("create-save").click();

  await expect(page.getByTestId("editor-tabs-slots")).toBeVisible();

  await expect(
    locateCardInSlots(page, "06008").getByTestId("quantity-value"),
  ).toContainText("3");
});

function locateScan(page: Page | Locator, code: string) {
  return page.getByAltText(`Scan of card ${code}`, { exact: true });
}

test("select parallel investigator", async ({ page }) => {
  await page.goto("/deck/create/01001");

  await expect(locateScan(page, "01001")).toBeVisible();
  await expect(locateScan(page, "01001b")).toBeVisible();

  await page.getByTestId("create-investigator-front").selectOption("90024");

  await expect(locateScan(page, "01001")).not.toBeVisible();
  await expect(locateScan(page, "90024")).toBeVisible();

  await expect(
    page.getByTestId("cardset-extra").locator("header"),
  ).toBeVisible();

  await page.getByTestId("create-investigator-back").selectOption("90024");

  await expect(locateScan(page, "01001b")).not.toBeVisible();
  await expect(locateScan(page, "90024b")).toBeVisible();

  await page.getByTestId("create-save").click();

  await expect(page.getByTestId("editor-tabs-slots")).toBeVisible();

  await expect(page.getByTestId("listcard-90025")).toBeVisible();
  await expect(page.getByTestId("listcard-90026")).toBeVisible();
  await expect(page.getByTestId("listcard-90027")).toBeVisible();
  await expect(page.getByTestId("listcard-90028")).toBeVisible();
  await expect(page.getByTestId("listcard-90029")).toBeVisible();

  await page
    .getByTestId("listcard-90024")
    .getByTestId("cardlist-item-title")
    .click();

  const cardModal = page.getByTestId("investigator-modal");

  await expect(locateScan(cardModal, "10001")).not.toBeVisible();
  await expect(locateScan(cardModal, "10001b")).not.toBeVisible();
  await expect(locateScan(cardModal, "90024")).toBeVisible();
  await expect(locateScan(cardModal, "90024b")).toBeVisible();
});

async function sumCardCounts(page: Page) {
  const elements = await page
    .getByTestId("editor-tabs-slots")
    .getByTestId("quantity-value")
    .all();

  let sum = 0;

  for (const el of elements) {
    const text = await el.innerText();
    sum += parseInt(text, 10);
  }

  return sum;
}

test("draw random basic weakness", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("collection-create-deck").click();
  await page.getByTestId("search-input").click();
  await page.getByTestId("search-input").fill("subje");

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
