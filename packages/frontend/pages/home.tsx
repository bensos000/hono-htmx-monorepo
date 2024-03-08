import NewTodo from "../components/newTodo";
import TodoList from "../components/todoList";
import Layout from "../layouts/layout";

export default function Home() {
  return (
    <Layout>
      <div className="mt-8 max-w-sm mx-auto">
        <div id="header" className="flex items-baseline justify-between"></div>
        <NewTodo />
        <TodoList />
        <script id="logout"></script>
      </div>
    </Layout>
  );
}
