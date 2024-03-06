export default function Login() {
  return (
    <div className="mt-8 w-full max-w-m dark:text-white">
      <h1 className="text-white">Login</h1>
      <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flow-root">
          <form 
          hx-post={`${process.env.BaseUrl}/api/login`}
          hx-target="#login-response"
          hx-ext="json-enc"
          >
            <label htmlFor="username">Username: </label>{" "}
            <input
              type="text"
              id="username"
              name="username"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <label htmlFor="username">Password: </label>{" "}
            <input
              type="password"
              id="password"
              name="password"
              className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <button type="submit">Login</button>
          </form>
          <span id="login-response" className="mt-5"></span>
        </div>
      </div>
    </div>
  );
}
