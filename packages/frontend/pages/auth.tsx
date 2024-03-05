import Login from "../components/login";
import Register from "../components/register";
import Layout from "../layouts/layout";

export default function Auth() {
  return (
    <Layout>
      <div className="mt-8 max-w-sm mx-auto">
        <Register />
        <Login />
      </div>
    </Layout>
  );
}
