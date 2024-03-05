export default function NewTodo() {
  return (
    <form
      hx-post={`${process.env.BaseUrl}/api/auth/todo`}
      hx-target="#todo-list"
      hx-swap="beforeend"
      hx-ext="json-enc"
    >
      <label
        htmlFor="content"
        className="block mb-2 text-sm font-medium text-white"
      >
        Create a Todo
      </label>
      <textarea
        id="content"
        name="content"
        rows={4}
        placeholder="Write something you have to do..."
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-5"
      />

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Create
      </button>
    </form>
  );
}
