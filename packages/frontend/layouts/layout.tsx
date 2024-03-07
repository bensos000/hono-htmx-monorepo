export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <html>
      <head>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <script src="https://unpkg.com/htmx.org/dist/ext/json-enc.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body
        className="bg-gray-800" 
        hx-get={`${process.env.BaseUrl}/api/token`}
        hx-trigger="load"
        id="token-api"
        hx-target="#token"
        hx-swap="innerHtml"
      >
        {children}
      </body>
      <script id="token"></script>
    </html>
  );
}
