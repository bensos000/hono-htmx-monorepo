import {
  renderOnlineUserCount,
  renderUserJoinNotification,
  renderUserMessage,
  renderUserLeaveNotification,
} from "./template";
import { generateUsername, sanitizeInput, currentTime } from "./utils";

interface User {
  username: string;
}

let users = new Map<string, User>();

const server = Bun.serve<{ username: string }>({
  port: 3004,
  fetch(req, server) {
    const username = generateUsername();
    const success = server.upgrade(req, { data: { username } });
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
    async message(ws, message) {
      try {
        const parsedMessage =
          typeof message === "string" ? JSON.parse(message) : message;

        if (!parsedMessage || typeof parsedMessage.message !== "string") {
          throw new Error("Invalid message format");
        }

        const formattedTime = currentTime();

        const sanitizedMessage = sanitizeInput(parsedMessage.message);

        const remoteMessage = renderUserMessage(
          ws.data.username,
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
    open(ws) {
      try {
        ws.subscribe("chatroom");
        const username = ws.data.username;
        users.set(username, { username });
        const userCount = renderOnlineUserCount(users.size);
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
    close(ws, code, message) {
      try {
        users.delete(ws.data.username);
        const userCount = renderOnlineUserCount(users.size);
        const userLeaveNotification = renderUserLeaveNotification(
          sanitizeInput(ws.data.username)
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
