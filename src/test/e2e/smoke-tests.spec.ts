import { expect, test } from "@playwright/test";

test.describe("smoke tests", () => {
  test("card list loads", { tag: "@smoke" }, async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("listcard-title").first()).toBeVisible();

    await page.getByTestId("search-input").click();
    await page.getByTestId("search-input").fill("deduc");

    await expect(page.getByTestId("listcard-title").first()).toContainText(
      "Deduction",
    );
  });
});
