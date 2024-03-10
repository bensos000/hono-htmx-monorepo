export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <html>
      <head>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <script src="https://unpkg.com/htmx.org/dist/ext/json-enc.js"></script>
        <script src="https://unpkg.com/htmx.org/dist/ext/ws.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gray-800">
        {" "}
        {/*hx-on--after-swap='htmx.trigger("body", "tokenAcquired")'*/}
        {children}
      </body>
      <script
        id="token"
        dangerouslySetInnerHTML={{
          __html: `
        
        const getCookieHeader = (e) => {
          const cookie = document.cookie; if (cookie === "" && window.location.pathname !== "/")
          window.location.href = "/"; e.detail.headers["Authorization"] = "Bearer " +
          cookie.split("=")[1];
        };
        const wsSetCookies = () => {
          if (document.getElementById("chat_box")) {
            let token = document.cookie.split("=")[1];
            document.getElementById("chat_box").setAttribute("ws-connect", "${process.env.WSUrl}/chatroom?token=" + token);  
          }
        };
        wsSetCookies();
        document.body.addEventListener("htmx:configRequest", (e) => { getCookieHeader(e); });
        document.body.addEventListener("htmx:wsBeforeMessage", (e) => { 
          wsSetCookies();
        });
        `,
        }}
      ></script>
    </html>
  );
}
