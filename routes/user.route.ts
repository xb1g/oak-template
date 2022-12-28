import { Router } from "oak";
import { User } from "../models/user.ts";

export const usersRouter = new Router();

usersRouter
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
