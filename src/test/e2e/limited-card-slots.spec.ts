import test, { expect } from "@playwright/test";
import { importDeckFromFile } from "./actions";
import { mockApiCalls } from "./mocks";

test.beforeEach(async ({ page }) => {
  await mockApiCalls(page);
});

test.describe("Limited card slots", () => {
  test("shows cards that occupy limited card slots", async ({ page }) => {
    await importDeckFromFile(page, "validation/limit_carolyn_versatile.json", {
      navigate: "edit",
    });
    await page
      .getByTestId("listcard-05001")
      .getByTestId("listcard-title")
      .click();

    await expect(page.getByTestId("limited-card-group")).toHaveCount(2);
    await expect(page.getByTestId("limited-card-stats").first()).toContainText(
      "15 / 15",
    );
    await expect(page.getByTestId("limited-card-stats").nth(1)).toContainText(
      "1 / 1",
    );
  });
});
