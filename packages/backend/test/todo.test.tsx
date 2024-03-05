import { describe, expect, it } from "bun:test";
import app from "../src";

let token: string = "";

describe("todo test", () => {
  it("should login a user", async () => {
    const req = new Request("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({ username: "test", password: "test" }),
    });
    const res = await app.fetch(req);
    token = (await res.text())!.split("=")[2]!.split(";")[0];
    expect(res.status).toBe(200);
  });
  it("should get all todos", async () => {
    const req = new Request("http://localhost/api/auth/todos", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
  });
  it("should add a todo", async () => {
    const req = new Request("http://localhost/api/auth/todo", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content: "test"}),
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
  });
  it("should update a todo", async () => {
    const id = "1";
    const req = new Request(`http://localhost/api/auth/todo/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
  });
  it("should delete a todo", async () => {
    const id = "1";
    const req = new Request(`http://localhost/api/auth/todo`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ todoId: id}),
    });
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
  });
});
