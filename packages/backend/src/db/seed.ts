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
  ]);
  console.log(`Seeding complete.`, await db.select().from(schema.users));
})();

