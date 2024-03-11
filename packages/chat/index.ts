import {
  renderOnlineUserCount,
  renderUserJoinNotification,
  renderUserMessage,
  renderUserLeaveNotification,
  renderAuthorization,
} from "./template";
import { sanitizeInput, currentTime } from "./utils";
import { verify } from "backend";
interface User {
  id?: string;
  username: string;
  password?: string;
  roles?: string;
}

let connectedUsers = new Map<string, User>();

const banIfNotAuthorized = async ({
  authorization,
  userId
}: {
  authorization: string;
  userId: string;
}) => {
  try {
    const payload = await verify(
      authorization.replace("Bearer ", ""),
      process.env.TokenSecret as string
    );
    if (userId === payload.id) return true;
    else return undefined;
  } catch (e) {
    return undefined;
  }
};

const getCurrentUser = async (ws: any) => {
  const wsCurrentUser = (await (
    await fetch(`${process.env.BackendUrl}/api/auth/ws-user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ws.data.token}`,
      },
    })
  ).json()) as any;

  return JSON.parse(wsCurrentUser.user)![0];
};

const server = Bun.serve<{ token: string }>({
  port: 3004,
  fetch(req, server) {
    const { searchParams } = new URL(req.url);

    const success = server.upgrade(req, {
      // this object must conform to WebSocketData
      data: {
        token: searchParams.get("token"),
      },
    });
    if (success) {
      // Bun automatically returns a 101 Switching Protocols
      // if the upgrade succeeds
      return undefined;
    }

    // handle HTTP request normally
    return new Response("Upgrade failed :(", { status: 500 });
  },
  websocket: {
    // this is called when a message is received
    async message(ws, message: any) {
      const user = await getCurrentUser(ws);
      const userFound = await banIfNotAuthorized({
        authorization: ws.data.token,
        userId: user.id,
      });

      if (!userFound) {
        ws.send(renderAuthorization());
        return;
      }
      try {
        const parsedMessage =
          typeof message === "string" ? JSON.parse(message) : message;

        if (!parsedMessage || typeof parsedMessage.message !== "string") {
          throw new Error("Invalid message format");
        }

        const formattedTime = currentTime();

        const sanitizedMessage = sanitizeInput(parsedMessage.message);

        const remoteMessage = renderUserMessage(
          user.username as string,
          sanitizedMessage,
          formattedTime,
          false
        );

        const localMessage = renderUserMessage(
          "you",
          sanitizedMessage,
          formattedTime,
          true
        );

        ws.publish("chatroom", remoteMessage);
        ws.send(localMessage);
      } catch (error) {
        console.error("Error in WebSocket message handler:", error);
      }
    },
    async open(ws) {
      const user = await getCurrentUser(ws);
      const userFound = await banIfNotAuthorized({
        authorization: ws.data.token,
        userId: user.id,
      });

      if (!userFound) {
        ws.send(renderAuthorization());
        return;
      }
      try {
        ws.subscribe("chatroom");
        const username = user.username as string;
        connectedUsers.set(username, { username });
        const userCount = renderOnlineUserCount(connectedUsers.size);
        const userJoinNotification = renderUserJoinNotification(
          sanitizeInput(username)
        );
        ws.publish("chatroom", userCount + userJoinNotification);
        ws.send(userCount);
      } catch (error) {
        console.error("Error in WebSocket open handler:", error);
      }
      console.log("Connection opened");
    }, // a socket is opened
    async close(ws, code, message) {
      const user = await getCurrentUser(ws);
      const userFound = await banIfNotAuthorized({
        authorization: ws.data.token,
        userId: user.id,
      });
      if (!userFound) {
        ws.send(renderAuthorization());
        return;
      }
      try {
        connectedUsers.delete(user.username as string);
        const userCount = renderOnlineUserCount(connectedUsers.size);
        const userLeaveNotification = renderUserLeaveNotification(
          sanitizeInput(user.username as string)
        );
        server.publish("chatroom", userCount + userLeaveNotification);
        ws.unsubscribe("chatroom");
      } catch (error) {
        console.error("Error in WebSocket close handler:", error);
      }
      console.log("Connection closed");
    }, // a socket is closed
    drain(ws) {}, // the socket is ready to receive more data
  },
});

console.log(`Server listening on ${server.hostname}:${server.port}`);
