import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
  SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src/index";

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("sensen-api Worker", () => {
  it("returns an API 404 for an unknown route", async () => {
    const request = new IncomingRequest("https://example.com/unknown");
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
});
