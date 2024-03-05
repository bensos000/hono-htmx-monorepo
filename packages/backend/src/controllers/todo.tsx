import { ITodo, TodoItem } from "shared";
import { Hono } from "hono";
import { todos as todoDb } from "../db";

const todosRoute = new Hono();

let todos = todoDb;

export const banIfNotAuthorized = (c: any) => {
  const authorization = c.req.header()["authorization"];
  return authorization;
};

export const getTodos = async (c: any) => {
  if (!banIfNotAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
  return c.html(
    <>
      {todos.map((todo) => (
        <TodoItem {...todo}></TodoItem>
      ))}
    </>
  );
};

export const addTodo = async (c: any) => {
  if (!banIfNotAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
  const { content } = await c.req.json();
  const todo = {
    id: `${Number(todos.length + 1)}`,
    content,
    timestamp: "12345566",
    completed: false,
  };
  todos.push(todo);
  return c.html(
    <>
      <TodoItem {...todo}></TodoItem>
    </>
  );
};

export const updateTodo = async (c: any) => {
  if (!banIfNotAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
  const id = c.req.param("id");
  let todo: ITodo | undefined = todos.find((todo) => todo.id === id);
  todo = {
    ...todo,
    completed: !todo?.completed,
  };
  todos = todos.filter((todo) => todo.id !== id);
  todos.push(todo);
  return c.html(
    <>
      <TodoItem {...todo}></TodoItem>
    </>
  );
};

export const deleteTodo = async (c: any) => {
  if (!banIfNotAuthorized(c)) return c.json({ error: "Unauthorized" }, 401);
  const { todoId } = await c.req.json();

  todos = todos.filter((todo) => todo.id !== todoId);
  return c.body("✔", 200, {
    "HX-Trigger": "todo-delete",
  });
};

todosRoute.get("/todos", getTodos);

todosRoute.post("/todo", addTodo);

todosRoute.put("/todo/:id", updateTodo);

todosRoute.delete("/todo", deleteTodo);

export default todosRoute;
