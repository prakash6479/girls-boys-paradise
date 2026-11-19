import { Hono } from "hono";
import type { Context } from "hono";
import { cors } from "hono/cors";
import type { Bindings } from "./env.js";

const app = new Hono<{ Bindings: Bindings }>();

app.use("/api/*", async (c, next) => {
  const origin = c.req.header("Origin");
  const env = c.env ?? {};
  const allowed = env.DASHBOARD_ORIGIN;
  if (origin && allowed && origin !== allowed) {
    return c.json({ error: { code: "ORIGIN_NOT_ALLOWED", message: "This origin is not allowed." } }, 403);
  }
  return cors({ origin: allowed ?? "http://localhost:5173", allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], allowHeaders: ["Content-Type", "Authorization"], maxAge: 600 })(c, next);
});

async function health(c: Context<{ Bindings: Bindings }>) {
  const database = c.env?.DB;
  let status: "ok" | "degraded" = "ok";
  let databaseStatus: "connected" | "not_configured" | "error" = "not_configured";
  if (database) {
    try {
      await database.prepare("SELECT 1").first();
      databaseStatus = "connected";
    } catch (error) {
      status = "degraded";
      databaseStatus = "error";
      console.error("D1 health check failed", { error: error instanceof Error ? error.message : "Unknown database error" });
    }
  } else {
    status = "degraded";
  }
  return c.json({ status, service: "gbp-api", timestamp: new Date().toISOString(), database: databaseStatus });
}

app.get("/health", health);
app.get("/api/health", health);
app.notFound((c) => c.json({ error: { code: "NOT_FOUND", message: "The requested API route does not exist." } }, 404));
app.onError((error, c) => {
  console.error("Unhandled API error", { name: error.name, message: error.message });
  return c.json({ error: { code: "INTERNAL_ERROR", message: "An unexpected server error occurred." } }, 500);
});

export default app;
