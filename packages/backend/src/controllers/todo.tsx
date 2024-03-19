import { TodoItem } from "shared";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { db } from "../db/db";
import { todos, users } from "../db/schema";
import { eq } from "drizzle-orm";

const todosRoute = new Hono();

export const banIfNotAuthorized = async (c: any) => {
  const authorization = c.req.header()["authorization"];
  try {
    const user = await verify(
      authorization.replace("Bearer ", ""),
      process.env.TokenSecret as string
    );
    return user;
  } catch (e) {
    return false;
  }
};

export const getTodos = async (c: any) => {
  const user = await banIfNotAuthorized(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  return c.html(
    <>
      {(await db.select().from(todos).where(eq(todos.user, user.id))).map(
        (todo) => (
          <TodoItem {...todo}></TodoItem>
        )
      )}
    </>
  );
};

export const addTodo = async (c: any) => {
  const user = await banIfNotAuthorized(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const { content } = await c.req.json();
  const todo = [
    {
      id: crypto.randomUUID(),
      content,
      timestamp: "12345566",
      completed: false,
      editable: false,
      user: user.id,
    },
  ];
  await db.insert(todos).values(todo);
  return c.html(
    <>
      <TodoItem {...todo[0]}></TodoItem>
    </>
  );
};

export const updateTodo = async (c: any) => {
  const user = await banIfNotAuthorized(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const id = c.req.param("id");
  const { content, editable, completed } = await c.req.json();
  let todo = await db.select().from(todos).where(eq(todos.id, id));
  if (todo.length > 0) {
    if (content) {
      todo[0].content = content;
      todo[0].editable = false;
    }
    if (Boolean(editable)) todo[0].editable = Boolean(editable);
    if (Boolean(completed) === true) todo[0].completed = true;
    else todo[0].completed = false;
    await db.update(todos).set(todo[0]).where(eq(todos.id, id));
  }
  return c.html(
    <>
      <TodoItem {...todo[0]}></TodoItem>
    </>
  );
};

export const deleteTodo = async (c: any) => {
  const user = await banIfNotAuthorized(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const todoId = await c.req.query("todoId");
  await db.delete(todos).where(eq(todos.id, todoId));
  return c.body("✔", 200, {
    "HX-Trigger": "todo-delete",
  });
};

export const getUserMenu = async (c: any) => {
  const authorization = c.req.header()["authorization"];
  let username = "";
  if (authorization) {
    try {
      const decodedPayload = await verify(
        authorization.replace("Bearer ", ""),
        process.env.TokenSecret as string
      );
      username = decodedPayload.username;
    } catch {
      return c.json({ error: "Invalid token" });
    }
  }
  return c.html(
    <>
      <h2 className="text-white">Welcome {username}</h2>
      <button
        hx-post={`${process.env.BaseUrl}/api/logout`}
        hx-trigger="click"
        hx-swap="innerHtml"
        hx-target="#logout"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-10"
      >
        Logout
      </button>
    </>
  );
};

export const WsGetUser = async (c: any) => {
  const user = await banIfNotAuthorized(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const found = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id));
  if (found.length > 0) {
    return c.json({ user: JSON.stringify(found) });
  } else {
    return c.json({ error: "No User Found" });
  }
};

todosRoute.get("/todos", getTodos);

todosRoute.post("/todo", addTodo);

todosRoute.put("/todo/:id", updateTodo);

todosRoute.delete("/todo", deleteTodo);

todosRoute.get("/user", getUserMenu);

todosRoute.get("/ws-user", WsGetUser);

export default todosRoute;
