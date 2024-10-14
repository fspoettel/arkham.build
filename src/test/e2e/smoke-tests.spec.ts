import { expect, test } from "@playwright/test";
import { fillSearch } from "./actions";

test.describe("smoke tests", () => {
  test("card list loads", { tag: "@smoke" }, async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("listcard-title").first()).toBeVisible();

    await fillSearch(page, "deduction");

    await expect(page.getByTestId("listcard-title").first()).toContainText(
      "Deduction",
    );
  });
});
