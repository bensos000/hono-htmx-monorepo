export default function Chat() {
  return (
    <div className="mt-8 w-full max-w-m dark:text-white">
      <h1 className="text-white">Chat</h1>
      <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flow-root">
          <div
            hx-ext="ws"
            hx-boost="true"
            ws-connect={`${process.env.WSUrl}/chatroom`}
          >
            <div>
              <h2 className="mb-5">Chat room</h2>
              <p className="underline mb-5">
                Users online: <span id="online_count"></span>
              </p>
            </div>
            <div id="chat_messages" className="mb-5"></div>
            <form id="chat_form" ws-send="true" hx-on:submit="this.reset()">
              <div className="flex">
                <input
                  type="text"
                  id="message"
                  name="message"
                  placeholder="say something"
                  className="block p-2 mr-5 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
