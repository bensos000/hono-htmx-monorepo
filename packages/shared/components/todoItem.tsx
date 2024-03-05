import type { ReactNode } from "react";
import type { ITodo } from "../schema/todos";

export default function TodoItem({
  id,
  content,
  timestamp,
  completed,
}: ITodo): ReactNode {
  return (
    <div id={`todo-completed-${id}`}>
      <li key={id} id={`todo-${id}`} className="py-3 sm:py-4">
        <div className="flex items-center">
          <div className="flex-1 min-w-0 ms-4">
            <p
              className={`text-sm font-medium text-gray-900 truncate ${
                completed ? "line-through" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={completed}
                hx-put={`${process.env.BaseUrl}/api/auth/todo/${id}`}
                hx-target={`#todo-completed-${id}`}
                hx-ext="json-enc"
                hx-swap="out"
                hx-trigger="click"
              />{" "}
              {content}
            </p>
            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
              {timestamp}
            </p>
          </div>
          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
            <button
              name="todoId"
              value={id}
              hx-delete={`${process.env.BaseUrl}/api/auth/todo`}
              hx-swap="delete"
              hx-target={`#todo-${id}`}
              hx-ext="json-enc"
              hx-trigger="click"
            >
              x
            </button>
          </div>
        </div>
      </li>
    </div>
  );
}
