import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { config } from "https://deno.land/std@0.167.0/dotenv/mod.ts";

import { Database, MongoDBConnector } from "https://deno.land/x/denodb/mod.ts";
import { User } from "./models/user.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

const envVars = (await config()) || Deno.env;
const dbUris = JSON.parse(envVars.DB_SERVERS);
console.log(Deno.env.toObject());
// const connector = new MongoDBConnector({
//   uri:
//     "mongodb+srv://xb1g:SecurePassword555@cluster0.karrdyx.mongodb.net/?retryWrites=true&w=majority" ||
//     // envVars.DATABASE_URL,
//     "mongodb://localhost:27017",
//   database: "test",
// });
const connector = new MongoDBConnector({
  database: envVars.DB_NAME,
  tls: true,
  servers: dbUris.map((uri: string) => {
    return {
      host: uri,
      port: 27017,
    };
  }),
  credential: {
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    db: envVars.DB_NAME,
    mechanism: "SCRAM-SHA-1",
  },
  db: envVars.DB_NAME,
});

const db = new Database(connector);
db.link([User]);
db.sync();

const app = new Application();
const router = new Router();

router
  .get("/", (ctx) => {
    ctx.response.body = "Hello World From Deno Edge";
  })
  .get("/users", async (ctx) => {
    const users = await User.all();
    ctx.response.body = users || [];
  })
  .get("/users/:id", async (ctx) => {
    const user = await User.find(ctx.params.id);
    ctx.response.body = user;
  })
  .post("/user", async (ctx) => {
    const body = await ctx.request.body({ type: "json" }).value;
    console.log(body);
    const user = await User.create({
      data: body,
    });
    ctx.response.body = user;
  })
  .delete("/user/:id", async (ctx) => {
    const user = await User.deleteById(ctx.params.id);
    ctx.response.body = user;
  });

app.use(router.routes());
app.use(router.allowedMethods());

//console.log("Server running on port 8000");
//await app.listen({ port: 8000 });
app.addEventListener("listen", (e) =>
  console.log("Listening on http://localhost:8080")
);

await app.listen({ port: 8080 });
