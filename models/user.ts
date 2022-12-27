import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";

export class User extends Model {
  static table = "users";
  static timestamps = true;

  static fields = {
    _id: {
      primaryKey: true,
    },
    name: DataTypes.STRING,
    contactId: DataTypes.STRING,
  };

  //   static defaults = {
  //     flightDuration: 2.5,
  //   };
}
