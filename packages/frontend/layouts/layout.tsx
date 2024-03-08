export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <html>
      <head>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <script src="https://unpkg.com/htmx.org/dist/ext/json-enc.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gray-800">
        {children}
      </body>
      <script
        id="token"
        dangerouslySetInnerHTML={{
          __html: `
        document.body.addEventListener("htmx:configRequest", (e) => { const cookie =
          document.cookie; if (cookie === "" && window.location.pathname !== "/")
          window.location.href = "/"; e.detail.headers["Authorization"] = "Bearer " +
          cookie.split("=")[1]; });
        `,
        }}
      ></script>
    </html>
  );
}
