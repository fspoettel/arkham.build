import { Page, expect, test } from "@playwright/test";
import { fillSearch } from "./actions";
import { mockApiCalls } from "./mocks";

test.describe("preview banner", () => {
  test("enable preview setting via preview banner" as any, async ({ page }) => {
    await mockApiCalls(page);
    await page.goto("/");

    await fillSearch(page, "nose to the grind stone");
    await expect(page.getByTestId("listcard-11111")).not.toBeVisible();

    await expect(page.getByTestId("preview-banner")).toBeVisible();
    await page.getByTestId("preview-banner-enable").click();

    await fillSearch(page, "nose to the grind stone");
    await expect(page.getByTestId("listcard-11111")).toBeVisible();

    await page.reload();
    await expect(page.getByTestId("search-input")).toBeVisible();
    await expect(page.getByTestId("preview-banner")).not.toBeVisible();
  });

  test("dismiss preview banner", async ({ page }) => {
    await mockApiCalls(page);
    await page.goto("/");
    await expect(page.getByTestId("preview-banner")).toBeVisible();
    await page.getByTestId("preview-banner-dismiss").click();
    await expect(page.getByTestId("preview-banner")).not.toBeVisible();

    await fillSearch(page, "nose to the grind stone");
    await expect(page.getByTestId("listcard-11111")).not.toBeVisible();

    await page.reload();
    await expect(page.getByTestId("search-input")).toBeVisible();
    await expect(page.getByTestId("preview-banner")).not.toBeVisible();
  });
});