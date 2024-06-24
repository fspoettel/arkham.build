import { expect, test } from "@playwright/test";

test("card list loads", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("search-input").click();
  await page.getByTestId("search-input").fill("deduc");
  await expect(page.getByTestId("cardlist-item-title").first()).toContainText(
    "Deduction",
  );
});
