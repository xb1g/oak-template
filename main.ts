import { Application, Router } from "oak";
import { config } from "dotenv";

import { Database, MongoDBConnector } from "denodb";
import { User } from "@/models/user.ts";
import { usersRouter } from "@/routes/user.route.ts";

const deployEnvs = Deno.env.toObject();
let envVars = await config();

if (deployEnvs.DENO_DEPLOYMENT_ID) {
  console.log(deployEnvs);
  envVars = deployEnvs;
}
console.log(envVars);

// if (Deno.env.toObject().ENV !== "development") {
//   console.log("envVars", envVars);
//   envVars.DB_SERVERS = Deno.env.get("DB_SERVERS") || envVars.DB_SERVERS;
//   envVars.DB_NAME = Deno.env.get("DB_NAME") || envVars.DB_NAME;
//   envVars.DB_USERNAME = Deno.env.get("DB_USERNAME") || envVars.DB_USERNAME;
//   envVars.DB_PASSWORD = Deno.env.get("DB_PASSWORD") || envVars.DB_PASSWORD;
// }

console.log("envVars", Deno.env.get("DB_SERVERS"));
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

router.use("/users", usersRouter.routes());

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
