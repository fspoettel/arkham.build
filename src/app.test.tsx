import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./app";

test("renders the example page", async () => {
  render(<App />);
  expect(await screen.findByText(/.*Vite.*/)).toBeVisible();
});
