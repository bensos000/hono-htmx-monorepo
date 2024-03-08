import NewTodo from "../components/newTodo";
import TodoList from "../components/todoList";
import Layout from "../layouts/layout";

export default function Home() {
  return (
    <Layout>
      <div className="mt-8 max-w-sm mx-auto">
        <div
          hx-get={`${process.env.BaseUrl}/api/auth/user`}
          hx-trigger="load"
          hx-target="this"
          className="flex items-baseline justify-between"
          //hx-sync="closest #token-api:loadend"
        ></div>
        <NewTodo />
        <TodoList />
        <script id="logout"></script>
      </div>
    </Layout>
  );
}
