import { ObjectId } from "mongo";
import { db } from "../db.ts";

interface UserSchema {
  _id: ObjectId;
  username: string;
}

export const Users = db.collection<UserSchema>("users");
