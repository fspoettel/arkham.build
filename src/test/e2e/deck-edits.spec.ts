import test, { Page, expect } from "@playwright/test";
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
