import Chat from "../components/chat";
import NewTodo from "../components/newTodo";
import TodoList from "../components/todoList";
import Layout from "../layouts/layout";

export default function Home() {
  return (
    <Layout>
      <div className="grid grid-cols-3 gap-4">
        <div className="mt-8 max-w-sm mx-auto">
          <Chat/>
        </div>
        <div className="mt-8 max-w-sm col-span-2">
          <div id="header" className="flex items-baseline justify-between"></div>
          <NewTodo />
          <TodoList />
          <script id="logout"></script>
        </div>
      </div>
      
    </Layout>
  );
}
