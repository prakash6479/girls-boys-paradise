import assert from "node:assert/strict";
import test from "node:test";
import app from "../src/index.js";
import type { Bindings } from "../src/env.js";

test("health endpoint reports an absent database binding honestly", async () => {
  const response = await app.request("/api/health");
  assert.equal(response.status, 200);
  const body = await response.json() as { status: string; service: string; database: string; timestamp: string };
  assert.equal(body.status, "degraded");
  assert.equal(body.service, "gbp-api");
  assert.equal(body.database, "not_configured");
  assert.equal(Number.isNaN(Date.parse(body.timestamp)), false);
});

test("health endpoint checks D1 instead of assuming that a binding is reachable", async () => {
  let query = "";
  const DB = { prepare: (sql: string) => { query = sql; return { first: async () => ({ healthy: 1 }) }; } } as unknown as D1Database;
  const response = await app.request("/api/health", undefined, { DB } satisfies Bindings);
  const body = await response.json() as { status: string; database: string };
  assert.equal(query, "SELECT 1");
  assert.equal(body.status, "ok");
  assert.equal(body.database, "connected");
});

test("unknown API routes return a consistent JSON not-found response", async () => {
  const response = await app.request("/api/not-a-route");
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: { code: "NOT_FOUND", message: "The requested API route does not exist." } });
});
