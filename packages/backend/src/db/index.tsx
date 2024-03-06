import { ITodo, IUsers } from "shared";

export let todos: ITodo[] = [
    { id: "1", content: "Learn Hono", timestamp: "12345566", completed: false, editable: false },
];

export let users: IUsers[] = [
    { id: "1", username: "test", password: "test", roles: [] },
];