import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import todosRoute from "./controllers/todo";
import authRoute from "./controllers/auth";

const app = new Hono().basePath("/api");

app.use(
  "/*",
  cors({
    origin: ["http://localhost:3002"],
  })
);

app.use(
  "/auth/*",
  jwt({
    // @ts-ignore:next-line
    secret: process.env.TokenSecret,
    cookie: "token",
  })
);

// controllers route
app.route("/auth", todosRoute);
app.route("/", authRoute);

export default {
  port: 3001,
  fetch: app.fetch,
};
