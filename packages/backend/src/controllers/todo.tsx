import { ITodo, TodoItem } from "shared";
import { Hono } from "hono";
import { todos as todoDb } from "../db";
import { verify } from "hono/jwt";
import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const todosRoute = new Hono();

let todos = todoDb;

export const banIfNotAuthorized = async (c: any) => {
  const authorization = c.req.header()["authorization"];
  try {
    await verify(
      authorization.replace("Bearer ", ""),
      process.env.TokenSecret as string
    );
    return true;
  } catch (e) {
    return false;
  }
};

export const getTodos = async (c: any) => {
  if (!(await banIfNotAuthorized(c)))
    return c.json({ error: "Unauthorized" }, 401);
  return c.html(
    <>
      {todos.map((todo) => (
        <TodoItem {...todo}></TodoItem>
      ))}
    </>
  );
};

export const addTodo = async (c: any) => {
  if (!(await banIfNotAuthorized(c)))
    return c.json({ error: "Unauthorized" }, 401);
  const { content } = await c.req.json();
  const todo = {
    id: `${Number(todos.length + 1)}`,
    content,
    timestamp: "12345566",
    completed: false,
    editable: false,
  };
  todos.push(todo);
  return c.html(
    <>
      <TodoItem {...todo}></TodoItem>
    </>
  );
};

export const updateTodo = async (c: any) => {
  if (!(await banIfNotAuthorized(c)))
    return c.json({ error: "Unauthorized" }, 401);
  const id = c.req.param("id");
  const { content, editable, completed } = await c.req.json();    
  let todo: ITodo | undefined = todos.find((todo) => todo.id === id);
  if (todo) {
    if (content) {
      todo.content = content;
      todo.editable = false;
    }
    if (Boolean(editable)) todo.editable = Boolean(editable);
    if (Boolean(completed) === true) todo.completed = true;
    else todo.completed = false;
    todos[Number(todo.id) - 1] = todo;
  }
  return c.html(
    <>
      <TodoItem {...todo}></TodoItem>
    </>
  );
};

export const deleteTodo = async (c: any) => {
  if (!(await banIfNotAuthorized(c)))
    return c.json({ error: "Unauthorized" }, 401);
  const { todoId } = await c.req.json();

  todos = todos.filter((todo) => todo.id !== todoId);
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
  const authorization = c.req.header()["authorization"];
  try {
    const user = await verify(
      authorization.replace("Bearer ", ""),
      process.env.TokenSecret as string
    );
    if (user) {
      const found = (await db.select().from(users).where(eq(users.username, user.username)));
      if (found.length > 0) {
       return c.json({ user: JSON.stringify(found) })
      } else {
        return c.json({ error: "No User Found" });
      }
    }
  } catch (e) {
    return c.json({ error: "Invalid token" });
  }
};

todosRoute.get("/todos", getTodos);

todosRoute.post("/todo", addTodo);

todosRoute.put("/todo/:id", updateTodo);

todosRoute.delete("/todo", deleteTodo);

todosRoute.get("/user", getUserMenu);

todosRoute.get("/ws-user", WsGetUser);

export default todosRoute;
