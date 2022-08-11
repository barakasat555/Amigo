import { ObjectId } from "mongodb";
import request from "request";
import DatabaseInit from "../Database/Collections/Live/index.mjs";
import SocketClient from "socket.io-client";
import Dotenv from "dotenv";
import nodeFetch from "node-fetch";

Dotenv.config();

const Socket = SocketClient(
  `http://realtime.${process.env.HOST?.replace?.("http://", "").replace(
    "https://",
    ""
  )}`
).connect();

const Connection = await DatabaseInit();
const LiveDB = Connection.Live;

let Times = 0;

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const GetStatusCode = async (url, ResourceID) => {
  if (url == "" || !url || !ResourceID) {
    IsAValidStream("Unset", "");
  } else {
    const Headers = {};
    Headers["Cache-Control"] = "no-cache";
    Headers["Pragma"] = "no-cache";
    Headers["Expires"] = "0";

    let controller = new AbortController();
    let signal = controller.signal;

    let response = await nodeFetch(url, {
      signal: signal,
      method: "GET",
      headers: {
        //Headers for a live stream
        "User-Agent": "Testing",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Accept: "*/*",
        Connection: "close",
        ...Headers,
      },
    });

    // console.log(response.status);
    if (
      response.headers.get("content-type")?.toLowerCase?.().includes?.("video")
      // ||
      // response.status == 200 ||
      // response.status == 206
    ) {
      IsAValidStream(true, url, ResourceID);
    } else {
      IsAValidStream(false, url, ResourceID);
    }
    try {
      controller.abort();
      response = undefined;
    } catch (error) {}
  }
};

let Working = 0;
let Fail = 0;

const IsAValidStream = async (IsValid, url, ResourceID) => {
  if (IsValid == "Unset") return false;

  if (IsValid) {
    Working += 1;
    const LastCheck = new Date();
    LiveDB.updateOne(
      { _id: ResourceID },
      { $set: { Status: true, LastCheck: LastCheck } }
    );

    Socket.volatile.emit(`ChannelStatus`, {
      Status: true,
      LastCheck: LastCheck,
      ID: ResourceID,
    });

    // console.info(`Active`, Times, IsValid, url);
  } else {
    Fail += 1;
    const Resource = await LiveDB.findOne(
      { _id: new ObjectId(ResourceID) },
      { projection: { LastDown: 1, Status: 1 } }
    );
    const { LastDown = false, Status = true } = Resource
      ? Resource
      : { LastDown: false, Status: true };

    Socket.volatile.emit(`ChannelStatus`, {
      Status: false,
      ID: ResourceID,
    });

    const Now = new Date();
    const LastDownDate = new Date(LastDown);
    const Difference = Now.getTime() - LastDownDate.getTime();
    const Minutes = Math.floor(Difference / 60000);
    if (!LastDown || Minutes >= 60 || Status) {
      const DownLastDate = new Date();

      LiveDB.updateOne(
        { _id: ResourceID },
        {
          $set: { Status: false, LastDown: DownLastDate },
          $inc: { DownCount: 1 },
        }
      );
    }
    console.error(`InActive`, Times, IsValid, url, ResourceID);
  }

  const FailedLives = await LiveDB.count({ Status: false });
  const WorkingLives = await LiveDB.count({ Status: true });

  Socket.emit("LiveChanges", {
    OnlineCount: WorkingLives,
    OfflineCount: FailedLives,
  });

  // console.log(
  //   `HOST: http://realtime.${process.env.HOST?.replace?.("http://", "").replace(
  //     "https://",
  //     ""
  //   )}`
  // );

  console.log(
    `Finished the test, ${Working} Working, ${Fail} Failed, ${Times} Run`
  );

  return true;
};

await sleep(60000);

let CanRequest = true;
while (CanRequest) {
  CanRequest = false;

  //LiveDB.find and only select _id and Url
  const Live = await LiveDB.find(
    {},
    { projection: { _id: 1, Url: 1 } }
  ).toArray();

  console.log(`Starting the test...`);
  for (let indexl = 0; indexl < Live.length; indexl++) {
    const element = Live[indexl];
    const ResourceLink = element?.Url;
    const ResourceID = element?._id;

    await sleep(50);
    // console.log(ResourcesLink);
    GetStatusCode(ResourceLink, ResourceID);
  }
  Times++;

  console.warn(`Preparing for the next Test!`);
  Working = 0;
  Fail = 0;
  CanRequest = true;
  process.exit(0);
}
