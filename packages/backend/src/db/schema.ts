import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username"),
  password: text("password"),
  roles: text('roles')
});

export const todos = sqliteTable("todos", {
  id: text("id").primaryKey(),
  content: text("content"),
  timestamp: text("timestamp"),
  completed: integer('completed', { mode: 'boolean' }),
  editable: integer('editable', { mode: 'boolean' }),
  user: text('user_id').notNull().references(() => users.id),
});