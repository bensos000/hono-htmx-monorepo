import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { todosOpenApiRoute } from "./todos";
import { authOpenApiRoute } from "./auth";

const appOpenApi = new OpenAPIHono();

appOpenApi.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Todos API",
  },
});

// openApi routes
appOpenApi.get("/ui", swaggerUI({ url: "/doc" }));
appOpenApi.route("/", todosOpenApiRoute);
appOpenApi.route("/", authOpenApiRoute);

export default {
  port: 3003,
  fetch: appOpenApi.fetch,
};
