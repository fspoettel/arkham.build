import { expect, test } from "@playwright/test";
import { mockApi } from "./http-mocks";

test("create deck", async ({ page }) => {
  await mockApi(page);
  await page.goto("/");
  await page.getByTestId("create-trigger").click();
  await page.getByTestId("search-input").click();
  await page.getByTestId("search-input").fill("jenny");

  await expect(page.getByTestId("cardlist-count")).toContainText("1 cards");

  await page.getByTestId("create-choose-investigator").click();
  await page.getByText("Replacements").click();
  await page.getByLabel("Signatures").click();
  await page.getByTestId("create-title").click();
  await page.getByTestId("create-title").fill("Jenny Test");
  await page.getByTestId("create-title").press("Tab");
  await page.getByTestId("create-taboo").selectOption("7");
  await page.getByTestId("create-save").click();

  await expect(page.getByTestId("deck-investigator")).toContainText(
    "Jenny Barnes",
  );

  await expect(page.getByTestId("deck-title")).toContainText("Jenny Test");

  await expect(
    page.getByRole("button", { name: "Green Man Medallion" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Sacrificial Beast" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Jenny's Twin .45s" }),
  ).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Searching for Izzie" }),
  ).not.toBeVisible();
});
