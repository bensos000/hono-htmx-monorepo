import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { getToken, loginUser, logoutUser, registerUser } from "../controllers/auth";

export const authOpenApiRoute = new OpenAPIHono();

const authRegisterRoute = createRoute({
  method: "post",
  path: "/api/register",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            username: z.string(),
            password: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "register response",
    },
  },
  tags: ["auth register"],
});

const authLoginRoute = createRoute({
  method: "post",
  path: "/api/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            username: z.string(),
            password: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "login response",
    },
  },
  tags: ["auth login"],
});

const authTokenRoute = createRoute({
  method: "get",
  path: "/api/token",
  responses: {
    200: {
      description: "token response",
    },
  },
  tags: ["auth token"],
});

const authLogoutRoute = createRoute({
  method: "post",
  path: "/api/logout",
  responses: {
    200: {
      description: "logout response",
    },
  },
  tags: ["auth logout"],
});

authOpenApiRoute.openapi(authRegisterRoute, registerUser);
authOpenApiRoute.openapi(authLoginRoute, loginUser);
authOpenApiRoute.openapi(authTokenRoute, getToken);
authOpenApiRoute.openapi(authLogoutRoute, logoutUser);
