import { Router } from "oak";
import { Users } from "../models/user.model.ts";
import { ObjectId } from "mongo";

export const usersRouter = new Router();

usersRouter
  .get("/", async (ctx) => {
    const users = await Users.find().toArray();
    ctx.response.body = users || [];
  })
  .get("/:id", async (ctx) => {
    const user = await Users.findOne({ _id: new ObjectId(ctx.params.id) });
    ctx.response.body = user;
  })
  .post("/", async (ctx) => {
    const body = await ctx.request.body({ type: "json" }).value;
    console.log(body);
    const user = await Users.insertOne(body);
    ctx.response.body = user;
  })
  .put("/:id", async (ctx) => {
    const body = await ctx.request.body({ type: "json" }).value;
    const user = await Users.updateOne(
      { _id: new ObjectId(ctx.params.id) },
      { $set: body }
    );
    ctx.response.body = user;
  })
  .delete("/:id", async (ctx) => {
    const user = await Users.deleteOne({ _id: new ObjectId(ctx.params.id) });
    ctx.response.body = user;
  });
