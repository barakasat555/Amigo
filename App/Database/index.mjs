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

const ClientsDB = await DB.listCollections().toArray();

const Movies_Collection = "Movies";
const Series_Collection = "Series";
const Episodes_Collection = "Episodes";
const Live_Collection = "Live";
const Sessions_Collection = "Sessions";
const Categories_Collection = "Categories";
const SubCategories_Collection = "SubCategories";
const Countries_Collection = "Countries";
const ActivationCodes_Collection = "ActivationCodes";
const Serials_Collection = "Serials";
const Clients_Collection = "Clients";
const SystemUsers_Collection = "SystemUsers";
const Periods_Collection = "Periods";
const Tags_Collection = "Tags";
const Settings_Collection = "Settings";
const Images_Collection = "Images";
const LiveViews_Collection = "LiveViews";

//Check if collections exists if not create them using process.env
const CollectinsToCreate = [
  Categories_Collection,
  SubCategories_Collection,
  Movies_Collection,
  Series_Collection,
  Episodes_Collection,
  Live_Collection,
  Sessions_Collection,
  Countries_Collection,
  ActivationCodes_Collection,
  Serials_Collection,
  Clients_Collection,
  SystemUsers_Collection,
  Periods_Collection,
  Tags_Collection,
  Settings_Collection,
  Images_Collection,
  LiveViews_Collection,
];

const CreateIndexes = async (Collection) => {
  //Create Index for Collection, The index includes keys which is Name and Type if the collection is Categories
  if (Collection === Categories_Collection) {
    await DB.collection(Collection).createIndex(
      { Name: 1, Type: 1 },
      { unique: true }
    );
  }
  //Create Index for Collection, The index includes keys which is Code if the collection is ActivationCodes
  if (Collection === ActivationCodes_Collection) {
    await DB.collection(Collection).createIndex({ Code: 1 }, { unique: true });
  }

  //Create Index for Collection, The index includes keys which is Name and Code if the collection is Countries
  if (Collection === Countries_Collection) {
    await DB.collection(Collection).createIndex(
      { Name: 1, Code: 1 },
      { unique: true }
    );
  }

  //Create Index for Collection, The index includes keys which is Series and Url if the collection is Episodes
  if (Collection === Episodes_Collection) {
    await DB.collection(Collection).createIndex(
      { Series: 1, Url: 1 },
      { unique: true }
    );
  }

  //Create Index for Collection, The index includes keys which is filename if the collection is Images
  if (Collection === Images_Collection) {
    await DB.collection(Collection).createIndex(
      { filename: 1 },
      { unique: true }
    );
  }

  if (Collection === LiveViews_Collection) {
    await DB.collection(Collection).createIndex(
      { SessionID: 1 },
      { unique: true }
    );
  }

  //Create Index for Collection, The index includes keys which is SubCategory and Name and Url if the collection is Live
  if (Collection === Live_Collection) {
    await DB.collection(Collection).createIndex(
      { SubCategory: 1, Name: 1, Url: 1 },
      { unique: true }
    );
  }

  //Create Index for Collection, The index includes keys which is Name and Url and SubCategory if the collection is Movies
  if (Collection === Movies_Collection) {
    await DB.collection(Collection).createIndex(
      { Name: 1, Url: 1, SubCategory: 1 },
      { unique: true }
    );
  }

  //Create Index for Collection if not exist, The index includes keys which is Period if the collection is Periods
  if (Collection === Periods_Collection) {
    await DB.collection(Collection).createIndex(
      { Period: 1 },
      { unique: true }
    );
  }

  //Create Index for Collection if not exist, The index includes keys which is Serial if the collection is Serials
  if (Collection === Serials_Collection) {
    await DB.collection(Collection).createIndex(
      { Serial: 1 },
      { unique: true }
    );
  }

  //Create Index for Collection if not exist, The index includes keys which is SubCategory and Name and Picture if the collection is Series
  if (Collection === Series_Collection) {
    await DB.collection(Collection).createIndex(
      { SubCategory: 1, Name: 1, Picture: 1 },
      { unique: true }
    );
  }

  //Create Index for Collection if not exist, The index includes keys which is Category and Name if the collection is SubCategories
  if (Collection === SubCategories_Collection) {
    await DB.collection(Collection).createIndex(
      { Category: 1, Name: 1 },
      { unique: true }
    );
  }

  //Create Index for Collection if not exist, The index includes keys which is Username if the collection is SystemUsers
  if (Collection === SystemUsers_Collection) {
    await DB.collection(Collection).createIndex(
      { Username: 1 },
      { unique: true }
    );
  }

  return true;
};

if (process.env.Backup && `${process?.env?.pm_id}` == `${0}`) {
  console.log(`Will start inserting backup if needed`);
  for (let index = 0; index < CollectinsToCreate.length; index++) {
    //Check if collection exists if not create it
    if (
      ClientsDB.find(
        (collection) => collection.name === CollectinsToCreate[index]
      ) === undefined
    ) {
      //Import json file from ../Backups/Database
      console.warn(
        `Inserting ./Database/Backups/Database/${CollectinsToCreate[index]}.json`
      );

      const Collection = await DB.createCollection(CollectinsToCreate[index]);
      try {
        const Data = JSON.parse(
          fs.readFileSync(
            `./Database/Backups/Database/${CollectinsToCreate[index]}.json`,
            "utf8"
          )
        );

        for (let index = 0; index < Data.length; index++) {
          const element = Data[index];
          const ID = element._id["$oid"];
          element._id = new ObjectId(ID);

          if (element?.CreatedAt) {
            const CreatedAt = element.CreatedAt["$date"];
            element.CreatedAt = new Date(CreatedAt);
          }

          if (element?.createdAt) {
            const createdAt = element.createdAt["$date"];
            element.createdAt = new Date(createdAt);
          }

          if (element?.updatedAt) {
            const updatedAt = element.updatedAt["$date"];
            element.updatedAt = new Date(updatedAt);
          }

          if (element?.UpdatedAt) {
            const UpdatedAt = element.UpdatedAt["$date"];
            element.UpdatedAt = new Date(UpdatedAt);
          }

          if (element?.ExpireAt) {
            const ExpireDate = element.ExpireAt;
            element.ExpireAt = new Date(ExpireDate["$date"]);
          }

          if (element?.expireAt) {
            const expireAt = element.expireAt;
            element.expireAt = new Date(expireAt["$date"]);
          }

          await Collection.insertOne(element);
        }
      } catch (error) {
        console.error(error);
      }

      try {
        await CreateIndexes(CollectinsToCreate[index]);
        console.warn(`Insured Indexes for ${CollectinsToCreate[index]}`);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log(`${CollectinsToCreate[index]} already exists`);
    }
  }
}

export default async () => {
  try {
    console.log("Connected successfully to server");
    return {
      //If the collection doesn't exist create it and return it else return the collection
      Categories: DB.collection(Categories_Collection),
      SubCategories: DB.collection(SubCategories_Collection),
      Movies: DB.collection(Movies_Collection),
      Series: DB.collection(Series_Collection),
      Episodes: DB.collection(Episodes_Collection),
      Live: DB.collection(Live_Collection),
      Sessions: DB.collection(Sessions_Collection),
      Countries: DB.collection(Countries_Collection),
      ActivationCodes: DB.collection(ActivationCodes_Collection),
      Serials: DB.collection(Serials_Collection),
      Clients: DB.collection(Clients_Collection),
      SystemUsers: DB.collection(SystemUsers_Collection),
      Periods: DB.collection(Periods_Collection),
      Tags: DB.collection(Tags_Collection),
      Settings: DB.collection(Settings_Collection),
      Images: DB.collection(Images_Collection),
      LiveViews: DB.collection(LiveViews_Collection),
      connection: connection,
    };
  } catch (err) {
    console.log(err);
    return {
      Categories: undefined,
      SubCategories: undefined,
      Movies: undefined,
      Series: undefined,
      Episodes: undefined,
      Live: undefined,
      Sessions: undefined,
      Countries: undefined,
      ActivationCodes: undefined,
      Serials: undefined,
      Clients: undefined,
      SystemUsers: undefined,
      Periods: undefined,
      Tags: undefined,
      Settings: undefined,
      Images: undefined,
      LiveViews: undefined,
      connection: undefined,
    };
  }
};
