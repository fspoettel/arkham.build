import type { Page } from "@playwright/test";
import allCardsResponse from "../fixtures/stubs/all_card.json" assert {
  type: "json",
};
import versionsResponse from "../fixtures/stubs/data_version.json" assert {
  type: "json",
};
import deckResponse from "../fixtures/stubs/get_deck.json" assert {
  type: "json",
};
import metadataResponse from "../fixtures/stubs/metadata.json" assert {
  type: "json",
};

export async function mockApiCalls(page: Page) {
  const apiUrl = process.env.VITE_API_URL ?? "https://api.arkham.build";

  const baseUrl = `${apiUrl}/api/v1`;

  const deckRegexp = new RegExp(`${baseUrl}/deck\.*`);

  await Promise.all([
    page.route(`${baseUrl}/cards`, async (route) => {
      const json = allCardsResponse;
      await route.fulfill({ json });
    }),
    page.route(`${baseUrl}/metadata`, async (route) => {
      const json = metadataResponse;
      await route.fulfill({ json });
    }),
    page.route(`${baseUrl}/version`, async (route) => {
      const json = versionsResponse;
      await route.fulfill({ json });
    }),
    page.route(deckRegexp, async (route) => {
      const json = deckResponse;
      await route.fulfill({ json });
    }),
  ]);
}
