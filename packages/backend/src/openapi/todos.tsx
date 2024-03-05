import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { addTodo, deleteTodo, getTodos, updateTodo } from "../controllers/todo";

export const todosOpenApiRoute = new OpenAPIHono();

todosOpenApiRoute.openAPIRegistry.registerComponent(
  "securitySchemes",
  "AuthorizationBearer",
  {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  }
);

const todosGetRoute = createRoute({
  method: "get",
  path: "/api/auth/todos",
  security: [
    {
      AuthorizationBearer: [],
    },
  ],
  responses: {
    200: {
      description: "todos response",
    },
  },
  tags: ["get todos"],
});

const todoPostRoute = createRoute({
  method: "post",
  path: "/api/auth/todo",
  security: [
    {
      AuthorizationBearer: [],
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            content: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "todos response",
    },
  },
  tags: ["add todo"],
});

const todoPutRoute = createRoute({
  method: "put",
  path: "/api/auth/todo/{id}",
  security: [
    {
      AuthorizationBearer: [],
    },
  ],
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: "id",
          in: "path",
        },
        type: "integer",
        example: "1",
      }),
    }),
  },
  responses: {
    200: {
      description: "todos response",
    },
  },
  tags: ["update todo"],
});

const todoDeleteRoute = createRoute({
  method: "delete",
  path: "/api/auth/todo",
  security: [
    {
      AuthorizationBearer: [],
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            todoId: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "todos response",
    },
  },
  tags: ["delete todo"],
});

todosOpenApiRoute.openapi(todosGetRoute, getTodos);
todosOpenApiRoute.openapi(todoPostRoute, addTodo);
todosOpenApiRoute.openapi(todoPutRoute, updateTodo);
todosOpenApiRoute.openapi(todoDeleteRoute, deleteTodo);
