import { createServer } from "http";
import { Server } from "socket.io";
import Dotenv from "dotenv";
Dotenv.config();

import DatabaseInit from "../Database/Collections/Live/index.mjs";
import { ObjectId } from "mongodb";
const Connection = await DatabaseInit();
const LiveDB = Connection.Live;
const LiveViewsDB = Connection.LiveViews;

const httpServer = createServer();
console.log(
  `HOST: http://dashboard.${process.env.HOST?.replace?.("http://", "").replace(
    "https://",
    ""
  )}`
);

const io = new Server(httpServer, {
  path: "/socket.io",
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  allowEIO3: true,
  cors: {
    origin: `*`,
    methods: "GET, POST",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("LiveChanges", (Data = {}) => {
    //Broadcast to all clients
    io.emit("LiveChanges", Data);
  });

  socket.on("ChannelStatus", ({ Status, ID }) => {
    //Broadcast to all clients
    io.volatile.emit(`${ID}`, { Status, ID });
  });

  socket.on("getWatchingNow", async () => {
    //Broadcast to all clients
    const TotalViews = await LiveViewsDB.count({});

    io.emit(`watchingNow`, TotalViews);
  });

  socket.on(
    "ChannelViews",
    async ({
      // LiveViews,
      ID,
      Status = false,
      Serial,
      CodeUsed,
      StartedAt,
      SessionID,
      Country,
    }) => {
      //Broadcast to all clients
      const Channels = await LiveDB.findOne({ _id: new ObjectId(`${ID}`) });
      const Name = Channels?.Name || "";
      if (Name == "") return;

      const Execute = () => {
        setTimeout(async () => {
          const Views = await LiveViewsDB.count({ ID: `${ID}` });

          io.emit(`Views_${ID}`, { LiveViews: Views, ID, Name });

          const TotalViews = await LiveViewsDB.count({});

          io.emit(`watchingNow`, TotalViews);
        }, 10);
      };

      if (!Status) {
        try {
          await LiveViewsDB.deleteMany({ ID: `${ID}` });
          Execute();
        } catch (error) {
          console.error(error);
          Execute();
        }
      } else {
        try {
          await LiveViewsDB.insertOne({
            SessionID: `${SessionID}`,
            ID: `${ID}`,
            Serial: Serial,
            CodeUsed: CodeUsed,
            StartedAt: new Date(),
            Country: Country,
          });

          Execute();
        } catch (error) {
          console.error(error);
          Execute();
        }
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log("listening on *:3000");
});
