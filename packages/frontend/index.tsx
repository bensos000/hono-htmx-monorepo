import { renderToReadableStream } from "react-dom/server";
import Home from "./pages/home";
import Auth from "./pages/auth";

const server = Bun.serve({
  port: 3002,
  async fetch(request) {
    const url = new URL(request.url);    
    let stream = await renderToReadableStream(<Auth />);
    if (url.pathname === "/todos") stream = await renderToReadableStream(<Home />);
    const response = new Response(stream, {
      headers: { "Content-Type": "text/html" },
    });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', '*');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    return response;
  },
});

console.log(`Server started on ${server.hostname}:${server.port}`);