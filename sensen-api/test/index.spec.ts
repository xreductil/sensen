import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
  SELF,
} from "cloudflare:test";
import { beforeAll, describe, it, expect } from "vitest";
import worker from "../src/index";

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("sensen-api Worker", () => {
  beforeAll(async () => {
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`).run();
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTEGER, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
        description TEXT, price INTEGER NOT NULL, stock INTEGER NOT NULL DEFAULT 0, image_key TEXT,
        is_active INTEGER DEFAULT 1, metadata_json TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`).run();
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS product_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL, image_key TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0, is_primary INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`).run();
    await env.DB.prepare(`CREATE TABLE IF NOT EXISTS news (
        id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL,
        category TEXT, excerpt TEXT, content TEXT, image_key TEXT,
        publish_at TEXT, is_published INTEGER DEFAULT 0, layout_json TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )`).run();
  });

  it("returns an API 404 for an unknown route", async () => {
    const request = new IncomingRequest("https://example.com/unknown/");
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "找不到 API 路徑。" });
  });

  it("returns a health response through the deployed Worker entrypoint", async () => {
    const response = await SELF.fetch("https://example.com/health");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, database: "connected" });
  });

  it("rejects a legacy news image proxy request for another host", async () => {
    const response = await SELF.fetch("https://example.com/images/legacy-news?url=https%3A%2F%2Fexample.com%2Fimage.jpg");
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: "不允許代理此圖片來源。" });
  });

  it("serves canonical and legacy image paths from R2", async () => {
    await env.BUCKET.put("images/test-r2.png", new Uint8Array([1, 2, 3]), {
      httpMetadata: { contentType: "image/png" },
    });
    await env.BUCKET.put("images/測試.png", new Uint8Array([4, 5, 6]), {
      httpMetadata: { contentType: "image/png" },
    });

    for (const pathname of ["/images/test-r2.png", "/assets/images/test-r2.png", `/images/${encodeURIComponent("測試.png")}`]) {
      const response = await SELF.fetch(`https://example.com${pathname}`);
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("image/png");
      expect([...new Uint8Array(await response.arrayBuffer())]).toEqual(pathname.includes("測試") || pathname.includes("%") ? [4, 5, 6] : [1, 2, 3]);
    }
  });

  it("does not serve the old website pages", async () => {
    const request = new IncomingRequest("https://example.com/cart?source=test", { redirect: "manual" });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "找不到 API 路徑。" });
  });

  it("does not serve old website redirects", async () => {
    const request = new IncomingRequest(`https://example.com/${encodeURIComponent("隱私權條件")}/`, { redirect: "manual" });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "找不到 API 路徑。" });
  });

  it("does not serve retired website content", async () => {
    const request = new IncomingRequest(`https://example.com/latest-news/${encodeURIComponent("2019頂家彌月目錄")}/`);
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "找不到 API 路徑。" });
  });

  it("does not serve old news article pages", async () => {
    const response = await SELF.fetch("https://example.com/latest-news/article/missing-news-for-seo/");
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "找不到 API 路徑。" });
  });
});
