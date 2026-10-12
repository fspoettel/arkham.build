import { randomUUID } from "node:crypto";
import type { DeckMutablePayload, OAuthScope } from "@arkham-build/shared";
import { describe, expect, vi } from "vitest";
import type { appFactory } from "../app.ts";
import type { Database } from "../db/db.ts";
import {
  OAuthDeckBatchResponseSchema,
  OAuthDeckManifestResponseSchema,
  OAuthDeckSchema,
  OAuthUserErrorSchema,
} from "../features/oauth-user/dtos.ts";
import {
  generateOAuthAccessToken,
  generateOAuthRefreshToken,
  hashOAuthCredential,
} from "../lib/oauth/crypto.ts";
import { TEST_ACCOUNT, test } from "./test-utils.ts";

describe("OAuth user deck routes", () => {
  test("reads account manifests, batches, and individual decks", async ({
    dependencies,
  }) => {
    const { app, db } = dependencies;
    const accessToken = await seedBearerToken(db, [
      "profile:read",
      "decks:read",
    ]);
    await insertAccountDeck(db, { id: "deck-b", version: "0.2" });
    await insertAccountDeck(db, { id: "deck-a", version: "0.1" });

    const firstManifestResponse = await bearerRequest(
      app,
      accessToken,
      "/v2/user/decks/manifest?source=account",
    );
    expect(firstManifestResponse.status).toBe(200);
    const firstManifest = OAuthDeckManifestResponseSchema.parse(
      await firstManifestResponse.json(),
    );
    expect(firstManifest.providers).toEqual({
      account: { available: true },
      arkhamdb: { available: false },
    });
    expect(firstManifest.arkhamdbSyncToken).toBeNull();
    expect(
      firstManifest.decks.map(({ id, source }) => ({ id, source })),
    ).toEqual([
      { id: "deck-a", source: "account" },
      { id: "deck-b", source: "account" },
    ]);

    const secondManifestResponse = await bearerRequest(
      app,
      accessToken,
      "/v2/user/decks/manifest?source=account",
    );
    const secondManifest = OAuthDeckManifestResponseSchema.parse(
      await secondManifestResponse.json(),
    );
    expect(secondManifest.version).toBe(firstManifest.version);

    const batchResponse = await bearerRequest(
      app,
      accessToken,
      "/v2/user/decks/batch",
      {
        method: "POST",
        body: JSON.stringify({
          decks: [
            { source: "account", id: "deck-b" },
            { source: "account", id: "deck-a" },
          ],
        }),
      },
    );
    expect(batchResponse.status).toBe(200);
    const batch = OAuthDeckBatchResponseSchema.parse(
      await batchResponse.json(),
    );
    expect(batch.decks.map((deck) => deck.id)).toEqual(["deck-b", "deck-a"]);

    const deckResponse = await bearerRequest(
      app,
      accessToken,
      "/v2/user/decks/account/deck-a",
    );
    expect(deckResponse.status).toBe(200);
    expect(OAuthDeckSchema.parse(await deckResponse.json())).toMatchObject({
      id: "deck-a",
      source: "account",
      version: "0.1",
    });
  });

  test("creates, replaces, upgrades, and deletes account deck history", async ({
    dependencies,
  }) => {
    const { app, db } = dependencies;
    const accessToken = await seedBearerToken(db, [
      "profile:read",
      "decks:read",
      "decks:write",
      "decks:delete",
    ]);
    const supplied = {
      ...deckPayload({ name: "Created deck" }),
      date_creation: "1999-01-01T00:00:00.000Z",
      date_update: "1999-01-01T00:00:00.000Z",
      id: "client-owned-id",
      next_deck: "ignored-next",
      previous_deck: "ignored-previous",
      source: "arkhamdb",
      user_id: 123,
      version: "99.99",
    };

    const createResponse = await bearerRequest(
      app,
      accessToken,
      "/v2/user/decks/account",
      { method: "POST", body: JSON.stringify(supplied) },
    );
    expect(createResponse.status).toBe(201);
    const created = OAuthDeckSchema.parse(await createResponse.json());
    expect(created).toMatchObject({
      name: "Created deck",
      next_deck: null,
      previous_deck: null,
      source: "account",
      version: "0.1",
    });
    expect(created.id).not.toBe(supplied.id);
    expect(created.date_creation).not.toBe(supplied.date_creation);

    const updateResponse = await bearerRequest(
      app,
      accessToken,
      `/v2/user/decks/account/${String(created.id)}`,
      {
        method: "PUT",
        body: JSON.stringify(
          deckPayload({
            name: "Replaced deck",
          }),
        ),
      },
    );
    expect(updateResponse.status).toBe(200);
    const updated = OAuthDeckSchema.parse(await updateResponse.json());
    expect(updated).toMatchObject({
      id: created.id,
      name: "Replaced deck",
      next_deck: null,
      previous_deck: null,
      source: "account",
      version: "0.2",
    });

    const upgradeResponse = await bearerRequest(
      app,
      accessToken,
      `/v2/user/decks/account/${String(created.id)}/upgrade`,
      {
        method: "POST",
        body: JSON.stringify(
          deckPayload({
            name: "Upgraded deck",
          }),
        ),
      },
    );
    expect(upgradeResponse.status).toBe(201);
    const upgraded = OAuthDeckSchema.parse(await upgradeResponse.json());
    expect(upgraded).toMatchObject({
      name: "Upgraded deck",
      previous_deck: created.id,
      source: "account",
      version: "0.1",
    });
    expect(upgraded.id).not.toBe(created.id);

    const parentResponse = await bearerRequest(
      app,
      accessToken,
      `/v2/user/decks/account/${String(created.id)}`,
    );
    const parent = OAuthDeckSchema.parse(await parentResponse.json());
    expect(parent).toMatchObject({
      next_deck: upgraded.id,
      version: "0.3",
    });

    const conflictResponse = await bearerRequest(
      app,
      accessToken,
      `/v2/user/decks/account/${String(created.id)}/upgrade`,
      { method: "POST", body: JSON.stringify(deckPayload()) },
    );
    await expectDeckError(conflictResponse, 409, "conflict");

    const deleteResponse = await bearerRequest(
      app,
      accessToken,
      `/v2/user/decks/account/${String(upgraded.id)}?all=true`,
      { method: "DELETE" },
    );
    expect(deleteResponse.status).toBe(204);

    for (const id of [created.id, upgraded.id]) {
      const response = await bearerRequest(
        app,
        accessToken,
        `/v2/user/decks/account/${String(id)}`,
      );
      await expectDeckError(response, 404, "not_found");
    }
  });

  test("updates a surviving deck revision when deletion clears its history link", async ({
    dependencies,
  }) => {
    const { app, db } = dependencies;
    const accessToken = await seedBearerToken(db, [
      "profile:read",
      "decks:read",
      "decks:delete",
    ]);
    await insertAccountDeck(db, { id: "history-parent", version: "0.1" });
    await insertAccountDeck(db, { id: "history-child", version: "0.1" });

    const staleTimestamp = new Date("2000-01-01T00:00:00.000Z");
    await db
      .updateTable("deck")
      .set({ next_deck: "history-child", updated_at: staleTimestamp })
      .where("id", "=", "history-parent")
      .executeTakeFirstOrThrow();
    await db
      .updateTable("deck")
      .set({ prev_deck: "history-parent" })
      .where("id", "=", "history-child")
      .executeTakeFirstOrThrow();

    const deleteResponse = await bearerRequest(
      app,
      accessToken,
      "/v2/user/decks/account/history-child",
      { method: "DELETE" },
    );
    expect(deleteResponse.status).toBe(204);

    const parent = await db
      .selectFrom("deck")
      .select(["next_deck", "updated_at", "version"])
      .where("id", "=", "history-parent")
      .executeTakeFirstOrThrow();
    expect(parent.next_deck).toBeNull();
    expect(parent.version).toBe("0.2");
    expect(parent.updated_at.getTime()).toBeGreaterThan(
      staleTimestamp.getTime(),
    );

    const manifestResponse = await bearerRequest(
      app,
      accessToken,
      "/v2/user/decks/manifest?source=account",
    );
    const manifest = OAuthDeckManifestResponseSchema.parse(
      await manifestResponse.json(),
    );
    expect(manifest.decks).toMatchObject([
      { id: "history-parent", source: "account", version: "0.2" },
    ]);
  });

  test("writes the supplied content to an upgraded ArkhamDB deck", async ({
    dependencies,
  }) => {
    const { app, db } = dependencies;
    const accessToken = await seedBearerToken(db, [
      "profile:read",
      "decks:read",
      "decks:write",
    ]);
    await insertArkhamDbConnection(db);

    const desiredDeck = deckPayload({
      description_md: "Updated description",
      exile_string: "02115,02115",
      meta: '{"option_selected":"guardian"}',
      name: "Upgraded deck",
      sideSlots: { "01020": 1 },
      slots: { "01006": 2, "01020": 1 },
      taboo_id: 3,
      tags: "campaign",
      xp: 8,
      xp_adjustment: 0,
      xp_spent: 3,
    });
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValueOnce(
        jsonResponse(
          arkhamDbDeck({
            xp: 5,
            xp_adjustment: 1,
            xp_spent: 2,
          }),
        ),
      )
      .mockResolvedValueOnce(jsonResponse({ msg: 124, success: true }))
      .mockResolvedValueOnce(jsonResponse({ msg: 124, success: true }))
      .mockResolvedValueOnce(
        jsonResponse(
          arkhamDbDeck({
            ...desiredDeck,
            id: 124,
            previous_deck: 123,
            version: "1.2",
          }),
        ),
      );
    vi.stubGlobal("fetch", fetch);

    const response = await bearerRequest(
      app,
      accessToken,
      "/v2/user/decks/arkhamdb/123/upgrade",
      { method: "POST", body: JSON.stringify(desiredDeck) },
    );

    expect(response.status).toBe(201);
    expect(OAuthDeckSchema.parse(await response.json())).toMatchObject({
      id: 124,
      name: "Upgraded deck",
      previous_deck: 123,
      slots: { "01006": 2, "01020": 1 },
      xp: 8,
    });
    expect(requestUrl(fetch.mock.calls[1]?.[0])).toBe(
      "https://arkhamdb.com/api/oauth2/deck/upgrade/123",
    );
    expect(fetch.mock.calls[1]?.[1]?.body).toBe("exiles=02115%2C02115&xp=4");
    expect(requestUrl(fetch.mock.calls[2]?.[0])).toBe(
      "https://arkhamdb.com/api/oauth2/deck/save/124",
    );

    const saveBody = fetch.mock.calls[2]?.[1]?.body;
    expect(typeof saveBody).toBe("string");
    if (typeof saveBody !== "string") throw new Error("Missing save body");

    expect(Object.fromEntries(new URLSearchParams(saveBody))).toMatchObject({
      description_md: "Updated description",
      meta: '{"option_selected":"guardian"}',
      name: "Upgraded deck",
      side: JSON.stringify({ "01020": 1 }),
      slots: JSON.stringify({ "01006": 2, "01020": 1 }),
      taboo: "3",
      tags: "campaign",
      xp_adjustment: "0",
      xp_spent: "3",
    });
  });

  test("reports when ArkhamDB creates a child but cannot save its content", async ({
    dependencies,
  }) => {
    const { app, db } = dependencies;
    const accessToken = await seedBearerToken(db, [
      "profile:read",
      "decks:read",
      "decks:write",
    ]);
    await insertArkhamDbConnection(db);

    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValueOnce(jsonResponse(arkhamDbDeck()))
      .mockResolvedValueOnce(jsonResponse({ msg: 124, success: true }))
      .mockResolvedValueOnce(
        jsonResponse({ error: "save failed" }, { status: 500 }),
      );
    vi.stubGlobal("fetch", fetch);

    const response = await bearerRequest(
      app,
      accessToken,
      "/v2/user/decks/arkhamdb/123/upgrade",
      { method: "POST", body: JSON.stringify(deckPayload()) },
    );

    expect(response.status).toBe(409);
    expect(OAuthUserErrorSchema.parse(await response.json())).toEqual({
      error: "conflict",
      message:
        "ArkhamDB created upgraded deck 124, but could not save the supplied deck content. The child deck remains linked in ArkhamDB.",
    });
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(
      fetch.mock.calls.some(([input]) =>
        requestUrl(input).includes("/delete/"),
      ),
    ).toBe(false);
  });

  test("enforces scopes, input limits, and whole-batch failure", async ({
    dependencies,
  }) => {
    const { app, db } = dependencies;
    const profileToken = await seedBearerToken(db, ["profile:read"]);
    const forbidden = await bearerRequest(
      app,
      profileToken,
      "/v2/user/decks/manifest",
    );
    expect(forbidden.status).toBe(403);
    expect(OAuthUserErrorSchema.parse(await forbidden.json()).error).toBe(
      "insufficient_scope",
    );

    const readToken = await seedBearerToken(db, ["profile:read", "decks:read"]);
    const tooManyTargets = Array.from({ length: 251 }, (_, index) => ({
      source: "account",
      id: `deck-${index}`,
    }));
    const limitResponse = await bearerRequest(
      app,
      readToken,
      "/v2/user/decks/batch",
      {
        method: "POST",
        body: JSON.stringify({
          arkhamdbSyncToken: null,
          decks: tooManyTargets,
        }),
      },
    );
    await expectDeckError(limitResponse, 400, "invalid_request");

    await insertAccountDeck(db, { id: "existing-deck", version: "0.1" });
    const missingResponse = await bearerRequest(
      app,
      readToken,
      "/v2/user/decks/batch",
      {
        method: "POST",
        body: JSON.stringify({
          arkhamdbSyncToken: null,
          decks: [
            { source: "account", id: "existing-deck" },
            { source: "account", id: "missing-deck" },
          ],
        }),
      },
    );
    await expectDeckError(missingResponse, 404, "not_found");

    const missingSyncTokenResponse = await bearerRequest(
      app,
      readToken,
      "/v2/user/decks/batch",
      {
        method: "POST",
        body: JSON.stringify({
          arkhamdbSyncToken: null,
          decks: [{ source: "arkhamdb", id: 1 }],
        }),
      },
    );
    await expectDeckError(missingSyncTokenResponse, 400, "invalid_request");

    const unavailableResponse = await bearerRequest(
      app,
      readToken,
      "/v2/user/decks/arkhamdb/1",
    );
    expect(unavailableResponse.status).toBe(503);
    expect(
      OAuthUserErrorSchema.parse(await unavailableResponse.json()).error,
    ).toBe("upstream_unavailable");

    const writeResponse = await bearerRequest(
      app,
      readToken,
      "/v2/user/decks/account",
      { method: "POST", body: JSON.stringify(deckPayload()) },
    );
    expect(writeResponse.status).toBe(403);
  });

  test("revalidates a manifest and reuses its snapshot across batches", async ({
    dependencies,
  }) => {
    const { app, db } = dependencies;
    const accessToken = await seedBearerToken(db, [
      "profile:read",
      "decks:read",
    ]);
    const identity = await insertArkhamDbConnection(db);
    const lastModified = "Thu, 30 Jul 2026 12:00:00 GMT";
    const snapshot = await db
      .insertInto("arkhamdb_deck_snapshot")
      .values({
        account_identity_id: identity.id,
        decks: JSON.stringify([
          arkhamDbDeck({ id: 123 }),
          arkhamDbDeck({ id: 456 }),
        ]),
        last_modified: lastModified,
      })
      .returning("id")
      .executeTakeFirstOrThrow();
    const fetch = vi.fn<typeof globalThis.fetch>((_input, init) => {
      expect(new Headers(init?.headers).get("If-Modified-Since")).toBe(
        lastModified,
      );
      return Promise.resolve(new Response(null, { status: 304 }));
    });
    vi.stubGlobal("fetch", fetch);

    const manifestResponse = await bearerRequest(
      app,
      accessToken,
      "/v2/user/decks/manifest?source=arkhamdb",
    );
    expect(manifestResponse.status).toBe(200);
    const manifest = OAuthDeckManifestResponseSchema.parse(
      await manifestResponse.json(),
    );
    expect(manifest.arkhamdbSyncToken).toBe(snapshot.id);

    const firstBatchResponse = await bearerRequest(
      app,
      accessToken,
      "/v2/user/decks/batch",
      {
        method: "POST",
        body: JSON.stringify({
          arkhamdbSyncToken: manifest.arkhamdbSyncToken,
          decks: [{ source: "arkhamdb", id: 123 }],
        }),
      },
    );
    expect(firstBatchResponse.status).toBe(200);
    const firstBatch = OAuthDeckBatchResponseSchema.parse(
      await firstBatchResponse.json(),
    );
    expect(firstBatch.decks).toEqual([expect.objectContaining({ id: 123 })]);

    const secondBatchResponse = await bearerRequest(
      app,
      accessToken,
      "/v2/user/decks/batch",
      {
        method: "POST",
        body: JSON.stringify({
          arkhamdbSyncToken: manifest.arkhamdbSyncToken,
          decks: [{ source: "arkhamdb", id: 456 }],
        }),
      },
    );
    expect(secondBatchResponse.status).toBe(200);
    const secondBatch = OAuthDeckBatchResponseSchema.parse(
      await secondBatchResponse.json(),
    );
    expect(secondBatch.decks).toEqual([expect.objectContaining({ id: 456 })]);
    expect(fetch).toHaveBeenCalledOnce();
  });

  test("rejects an unavailable ArkhamDB snapshot", async ({ dependencies }) => {
    const { app, db } = dependencies;
    const accessToken = await seedBearerToken(db, [
      "profile:read",
      "decks:read",
    ]);
    await insertArkhamDbConnection(db);
    const fetch = vi.fn<typeof globalThis.fetch>();
    vi.stubGlobal("fetch", fetch);

    const response = await bearerRequest(
      app,
      accessToken,
      "/v2/user/decks/batch",
      {
        method: "POST",
        body: JSON.stringify({
          arkhamdbSyncToken: randomUUID(),
          decks: [{ source: "arkhamdb", id: 123 }],
        }),
      },
    );

    await expectDeckError(response, 409, "conflict");
    expect(fetch).not.toHaveBeenCalled();
  });

  test("returns partial manifests when ArkhamDB is unavailable", async ({
    dependencies,
  }) => {
    const { app, db } = dependencies;
    const accessToken = await seedBearerToken(db, [
      "profile:read",
      "decks:read",
    ]);
    await insertAccountDeck(db, { id: "local-deck", version: "0.1" });
    await insertArkhamDbConnection(db);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: "upstream failure" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    const response = await bearerRequest(
      app,
      accessToken,
      "/v2/user/decks/manifest",
    );
    expect(response.status).toBe(200);
    const manifest = OAuthDeckManifestResponseSchema.parse(
      await response.json(),
    );
    expect(manifest.providers.arkhamdb.available).toBe(false);
    expect(manifest.arkhamdbSyncToken).toBeNull();
    expect(manifest.decks).toEqual([
      expect.objectContaining({ id: "local-deck", source: "account" }),
    ]);
  });

  test("rejects non-decimal ArkhamDB IDs before forwarding requests", async ({
    dependencies,
  }) => {
    const { app, db } = dependencies;
    const accessToken = await seedBearerToken(db, [
      "profile:read",
      "decks:read",
      "decks:write",
      "decks:delete",
    ]);
    await insertArkhamDbConnection(db);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const requests = [
      { method: "GET", path: "/v2/user/decks/arkhamdb/not-a-number" },
      {
        method: "PUT",
        path: "/v2/user/decks/arkhamdb/..%2Fpublish%2F123",
        body: JSON.stringify(deckPayload()),
      },
      {
        method: "DELETE",
        path: "/v2/user/decks/arkhamdb/123%3Ffoo=bar",
      },
      {
        method: "POST",
        path: "/v2/user/decks/arkhamdb/0/upgrade",
        body: JSON.stringify(deckPayload()),
      },
    ];

    for (const request of requests) {
      const response = await bearerRequest(
        app,
        accessToken,
        request.path,
        request,
      );
      await expectDeckError(response, 400, "invalid_request");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

type App = ReturnType<typeof appFactory>;

async function seedBearerToken(db: Database, scopes: OAuthScope[]) {
  const account = await db
    .selectFrom("account")
    .select("id")
    .where("name", "=", TEST_ACCOUNT.name)
    .executeTakeFirstOrThrow();
  const client = await db
    .insertInto("oauth_client")
    .values({
      id: randomUUID(),
      name: "OAuth deck test client",
      secret_hash: "test-secret-hash",
    })
    .returning("id")
    .executeTakeFirstOrThrow();
  const grant = await db
    .insertInto("oauth_grant")
    .values({
      account_id: account.id,
      oauth_client_id: client.id,
      scopes,
    })
    .returning("id")
    .executeTakeFirstOrThrow();
  const refreshToken = generateOAuthRefreshToken();
  const refresh = await db
    .insertInto("oauth_refresh_token")
    .values({
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      oauth_grant_id: grant.id,
      scopes,
      token_hash: hashOAuthCredential(refreshToken),
    })
    .returning("id")
    .executeTakeFirstOrThrow();
  const accessToken = generateOAuthAccessToken();
  await db
    .insertInto("oauth_access_token")
    .values({
      expires_at: new Date(Date.now() + 60 * 60 * 1000),
      oauth_grant_id: grant.id,
      oauth_refresh_token_id: refresh.id,
      scopes,
      token_hash: hashOAuthCredential(accessToken),
    })
    .execute();
  return accessToken;
}

async function insertAccountDeck(
  db: Database,
  input: { id: string; version: string },
) {
  const account = await db
    .selectFrom("account")
    .select("id")
    .where("name", "=", TEST_ACCOUNT.name)
    .executeTakeFirstOrThrow();
  await db
    .insertInto("deck")
    .values({
      account_id: account.id,
      description: "",
      id: input.id,
      investigator_code: "01001",
      investigator_name: "Roland Banks",
      meta: {},
      name: input.id,
      provider_type: "account",
      slots: { "01006": 1 },
      version: input.version,
    })
    .execute();
}

async function insertArkhamDbConnection(db: Database) {
  const account = await db
    .selectFrom("account")
    .select("id")
    .where("name", "=", TEST_ACCOUNT.name)
    .executeTakeFirstOrThrow();
  const identity = await db
    .insertInto("account_identity")
    .values({
      account_id: account.id,
      provider: "arkhamdb",
      provider_user_id: "oauth-deck-test-user",
      verified_at: new Date(),
    })
    .returning("id")
    .executeTakeFirstOrThrow();
  await db
    .insertInto("oauth_token")
    .values({
      account_identity_id: identity.id,
      access_token: "arkhamdb-access-token",
      refresh_token: "arkhamdb-refresh-token",
      token_expires_at: new Date(Date.now() + 60 * 60 * 1000),
    })
    .execute();

  return identity;
}

function deckPayload(
  overrides: Partial<DeckMutablePayload> = {},
): DeckMutablePayload {
  return {
    description_md: "",
    exile_string: null,
    ignoreDeckLimitSlots: null,
    investigator_code: "01001",
    investigator_name: "Roland Banks",
    meta: "{}",
    name: "OAuth deck",
    problem: null,
    sideSlots: null,
    slots: { "01006": 1 },
    taboo_id: null,
    tags: "",
    xp_adjustment: 0,
    xp_spent: 0,
    xp: 0,
    ...overrides,
  };
}

function requestUrl(input: string | URL | Request | undefined) {
  if (!input) throw new Error("Missing request URL");
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(body), { ...init, headers });
}

function arkhamDbDeck(overrides: Record<string, unknown> = {}) {
  return {
    date_creation: "2026-01-01T00:00:00.000Z",
    date_update: "2026-01-02T00:00:00.000Z",
    id: 123,
    investigator_code: "01001",
    investigator_name: "Roland Banks",
    meta: "{}",
    name: "Arkham deck",
    slots: { "01006": 1 },
    version: "1.1",
    xp: 0,
    xp_adjustment: 0,
    xp_spent: 0,
    ...overrides,
  };
}

function bearerRequest(
  app: App,
  token: string,
  path: string,
  options: { method?: string; body?: string } = {},
) {
  return app.request(path, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    ...(options.body ? { body: options.body } : {}),
  });
}

async function expectDeckError(
  response: Response,
  status: number,
  error: "invalid_request" | "not_found" | "conflict",
) {
  expect(response.status).toBe(status);
  expect(OAuthUserErrorSchema.parse(await response.json())).toMatchObject({
    error,
  });
}
