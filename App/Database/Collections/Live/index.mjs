//Init mongodb connection pool
import { MongoClient, ObjectId } from "mongodb";
import Dotenv from "dotenv";
import fs from "fs";
// import SystemUser from "../SystemUser.mjs";
// import Countries from "../Countries.mjs";
Dotenv.config();

const url = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_IP}:${process.env.MONGODB_PORT}`;

console.log(url);
const client = new MongoClient(url, {
  readPreference: "primary",
  directConnection: true,
  ssl: false,
  authSource: process.env.MONGODB_SOURCE,
  keepAlive: true,
  socketTimeoutMS: 60000,
});

const connection = await client.connect();

const DB = connection.db(process.env.MONGODB_DB);

const Live_Collection = "Live";
const LiveViews_Collection = "LiveViews";

const CreateIndexes = async (Collection) => {
  await db.collection(Collection).dropIndex( "SubCategory_1_Url_1" )
  await DB.collection(Collection).createIndex(
    { _id: 1, SubCategory: 1, Url: 1 },
    { unique: true }
  );

  return true;
};
CreateIndexes(Live_Collection);

export default async () => {
  try {
    console.log("Connected successfully to server");
    return {
      //If the collection doesn't exist create it and return it else return the collection
      Live: DB.collection(Live_Collection),
      LiveViews: DB.collection(LiveViews_Collection),
      connection: connection,
    };
  } catch (err) {
    console.log(err);
    return {
      Live: undefined,
      LiveViews: undefined,
      connection: undefined,
    };
  }
};
