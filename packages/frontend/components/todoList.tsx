export default function TodoList() {
  return (
    <div className="mt-8 w-full max-w-m dark:text-white">
      <h1 className="text-white">My Todos</h1>
      <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flow-root">
          <ul
            hx-get={`${process.env.BaseUrl}/api/auth/todos`}
            hx-trigger="load delay:100ms, todo-delete from:body"
            hx-target="#todo-list"
            id="todo-list"
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          ></ul>
        </div>
      </div>
    </div>
  );
}
