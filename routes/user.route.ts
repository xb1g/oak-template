import { Router } from "oak";
import { User } from "../models/user.ts";

export const usersRouter = new Router();

usersRouter
  .get("/", async (ctx) => {
    const users = await User.all();
    ctx.response.body = users || [];
  })
  .get("/:id", async (ctx) => {
    const user = await User.find(ctx.params.id);
    ctx.response.body = user;
  })
  .post("/", async (ctx) => {
    const body = await ctx.request.body({ type: "json" }).value;
    console.log(body);
    const user = await User.create({
      data: body,
    });
    ctx.response.body = user;
  })
  .delete("/:id", async (ctx) => {
    const user = await User.deleteById(ctx.params.id);
    ctx.response.body = user;
  });
