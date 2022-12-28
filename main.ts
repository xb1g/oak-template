import { Application, Router } from "oak";
import { config } from "https://deno.land/std@0.167.0/dotenv/mod.ts";

import { Database, MongoDBConnector } from "denodb";
import { User } from "@/models/user.ts";
import { usersRouter } from "@/routes/user.route.ts";

const envVars = (await config()) || {
  DB_SERVERS: Deno.env.get("DB_SERVERS"),
  DB_NAME: Deno.env.get("DB_NAME"),
  DB_USERNAME: Deno.env.get("DB_USERNAME"),
  DB_PASSWORD: Deno.env.get("DB_PASSWORD"),
};
console.log("envVars", envVars);
const dbUris = JSON.parse(envVars.DB_SERVERS);

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

router.use(usersRouter.routes());

router.get("/", (ctx) => {
  ctx.response.body = "Hello World From Deno Edge";
});

app.use(router.routes());
app.use(router.allowedMethods());

//console.log("Server running on port 8000");
//await app.listen({ port: 8000 });
app.addEventListener("listen", (e) =>
  console.log("Listening on http://localhost:8080")
);

await app.listen({ port: 8080 });
