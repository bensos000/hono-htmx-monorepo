import { Hono } from "hono";
import { sign } from "hono/jwt";
import { deleteCookie, setCookie } from "hono/cookie";
import { html } from "hono/html";
import { users as usersFromDb } from "../db";

const HtmxSetTokenCookie = (token: string) =>
  html` <script>
    document.cookie = "token=${token};Max-Age=900;path=/;";
    window.location.href = "${process.env.FrontendUrl}/todos";
  </script>`;

const HtmxTokenCookieListener = () =>
  html`
    document.body.addEventListener("htmx:configRequest", (e) => { const cookie =
    document.cookie; if (cookie === "" && window.location.pathname !== "/")
    window.location.href = "/"; e.detail.headers["Authorization"] = "Bearer " +
    cookie.split("=")[1]; });
  `;

const HtmxTokenDelete = () =>
  html` cookieStore.delete("token"); window.location.href = "/"; `;

const authRoute = new Hono();

let users = usersFromDb;

export const registerUser = async (c: any) => {
  const { username, password } = await c.req.json();

  if (!username || !password) {
    return c.html(<h2>Username and password are required</h2>);
  }

  if (users.find((user) => user.username === username)) {
    return c.html(<h2>Username already exists</h2>);
  }

  const id = crypto.randomUUID();
  const hashedPassword = await Bun.password.hash(password);

  users.push({
    id,
    username,
    password: hashedPassword,
    roles: [],
  });

  return c.html(<h2>User registered successfully</h2>);
};

export const loginUser = async (c: any) => {
  const { username, password } = await c.req.json();
  const user = users.find((user) => user.username === username);
  if (!user || password !== user.password) {
    return c.html(<h2>User not found or wrong password</h2>);
  }
  const token = await sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.TokenSecret as string
  );

  setCookie(c, "token", token, {
    httpOnly: true,
    maxAge: 15 * 60, // 15 minutes
    path: "/",
  });

  return c.html(HtmxSetTokenCookie(token));
};

export const logoutUser = (c: any) => {
  deleteCookie(c, "token");
  return c.html(HtmxTokenDelete());
};

export const getToken = (c: any) => {
  return c.html(HtmxTokenCookieListener());
};

authRoute.post("/register", registerUser);

authRoute.post("/login", loginUser);

authRoute.post("/logout", logoutUser);

authRoute.get("/token", getToken);

export default authRoute;
