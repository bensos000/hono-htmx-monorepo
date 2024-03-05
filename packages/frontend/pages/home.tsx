import NewTodo from "../components/newTodo";
import TodoList from "../components/todoList";
import Layout from "../layouts/layout";

export default function Home() {
  return (
    <Layout>
      <div className="mt-8 max-w-sm mx-auto">
        <button
          hx-post={`${process.env.BaseUrl}/api/logout`}
          hx-trigger="click"
          hx-swap="innerHtml"
          hx-target="#logout"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-10"
        >
          Logout
        </button>
        <NewTodo />
        <TodoList />
        <script id="logout"></script>
      </div>
    </Layout>
  );
}
