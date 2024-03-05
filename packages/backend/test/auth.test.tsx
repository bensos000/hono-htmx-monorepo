import { describe, expect, it } from "bun:test";
import app from "../src";

describe("Authentication test", () => {
  it("should register a user", async () => {
    const req = new Request("http://localhost/api/register", {
      method: "POST",
      body: JSON.stringify({ username: "test", password: "test" }),
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("<h2>Username already exists</h2>");
  });
  it("should login a user", async () => {
    const req = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({ username: "test", password: "test" }),
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
  });
  it("should getToken of a user", async () => {
    const req = new Request("http://localhost/api/token");
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
  });
  it("should logout user", async () => {
    const req = new Request("http://localhost/api/logout", {
      method: "POST",
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
  });
});
