import type { ReactNode } from "react";
import type { ITodo } from "../schema";

export default function TodoItem({
  id,
  content,
  timestamp,
  completed,
  editable,
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
                name="completed"
                checked={completed}
                value={completed ? `true` : `false`}
                hx-put={`${process.env.BaseUrl}/api/auth/todo/${id}`}
                hx-target={`#todo-completed-${id}`}
                hx-ext="json-enc"
                hx-swap="outerHTML"
                hx-trigger="click"
              />{" "}
              {editable && (
                <input
                  name="content"
                  type="text"
                  value={`${content}`}
                  hx-put={`${process.env.BaseUrl}/api/auth/todo/${id}`}
                  hx-target={`#todo-completed-${id}`}
                  hx-ext="json-enc"
                  hx-swap="outerHTML"
                  className="border-gray-900 rounded-md"
                  autoFocus
                  hx-trigger="keyup[keyCode==13]"
                />
              )}
              {!editable && content}
            </p>
            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
              {timestamp}
            </p>
          </div>
          <div className="flex items-center text-base font-semibold text-gray-900 dark:text-white">
            <button
              name="editable"
              value={editable ? "false" : "true"}
              hx-put={`${process.env.BaseUrl}/api/auth/todo/${id}`}
              hx-swap="outerHTML"
              hx-target={`#todo-completed-${id}`}
              hx-ext="json-enc"
              hx-trigger="click"
              className="mr-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-50"
            >
              edit
            </button>{" "}
            <button
              name="todoId"
              value={id}
              hx-delete={`${process.env.BaseUrl}/api/auth/todo`}
              hx-swap="delete"
              hx-target={`#todo-${id}`}
              hx-ext="json-enc"
              hx-trigger="click"
              className="mr-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-50"
            >
              delete
            </button>
          </div>
        </div>
      </li>
    </div>
  );
}
