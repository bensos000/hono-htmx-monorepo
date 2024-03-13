import { db } from "./db";
import * as schema from "./schema";

(async () => {
  await db.insert(schema.users).values([
    {
      id: "1",
      username: "test",
      password: "test",
      roles: JSON.stringify([]),
    },
  ]).onConflictDoNothing();
  await db.insert(schema.todos).values([
    {
      id: "1",
      content: "test1",
      timestamp: "12345678",
      editable: false,
      completed: false,
      user: "1",
    },
  ]).onConflictDoNothing();
  console.log(`Seeding complete.`, await db.select().from(schema.users));
})();

