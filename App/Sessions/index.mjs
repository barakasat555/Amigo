import express from "express";
import Dotenv from "dotenv";
Dotenv.config();
import fs from "fs";
import DatabaseInit from "../Database/index.mjs";
const router = express.Router();
const RootDB = await DatabaseInit();
const DB = RootDB.Series;
const EpisodesDB = RootDB.Episodes;
const SessionsDB = RootDB.Sessions;
const MoviesDB = RootDB.Movies;
const LiveDB = RootDB.Live;
const SettingsDB = RootDB.Settings;
const LiveViewsDB = RootDB.LiveViews;

import { ObjectId } from "mongodb";

import SocketClient from "socket.io-client";

const Socket = SocketClient(
  `http://realtime.${process.env.HOST?.replace?.("http://", "").replace(
    "https://",
    ""
  )}`
).connect();

// import axios from "axios"
// import got from "got";
// import https from "https"
// import http from "http"
// import GrowingFile from "growing-file"
// import mimeDb from "mime-db";

// import feedIt from "feedit";
// import fetch from "node-fetch";
import request from "request";

import axios from "axios";

import nodeFetch from "node-fetch";

// console.log = function () {};
// console.warn = function () {};
// console.error = function () {};

console.warn("Sessions Ready.");

router.get("/CheckSession/:id", async (req, res) => {
  const Country = res.getHeader("Country");
  const IP = res.getHeader("IP");
  const { id = "" } = req.params;
  //Check if id is a valid ObjectId
  if (!ObjectId.isValid(id)) return res.status(400).send("Invalid ID");

  const {
    MacAddress = "",
    SerialNumber = "",
    Code = "",
    Tag = "",
  } = req?.query ? req?.query : req?.body;

  let SettingsQuery = await SettingsDB.find({}).toArray();

  const { UnAuhtorized, NotFound } = SettingsQuery[0] ? SettingsQuery[0] : {};

  if (
    id.length <= 0 ||
    MacAddress.length <= 0 ||
    SerialNumber.length <= 0 ||
    Code.length <= 0 ||
    Tag.length <= 0
  )
    return res.status(404).json({ message: NotFound, isValid: false });

  const SessionQuery = await SessionsDB.findOne({
    _id: ObjectId(`${id}`),
    MacAddress: `${MacAddress}`,
    SerialNumber: `${SerialNumber}`,
    Code: `${Code}`,
    IP: `${IP}`,
    Country: `${Country}`,
  });

  if (!SessionQuery)
    return res.status(404).json({ message: NotFound, isValid: false });

  const { Url, Type } = SessionQuery;

  res.status(200).json({ link: Url, typeOfVideo: Type, isValid: true }).end?.();
});

let Views = 0;
router.get("/:id", async (req, res) => {
  const Country = res.getHeader("Country");

  let SettingsQuery = await SettingsDB.find({}).toArray();

  const { UnAuhtorized, NotFound } = SettingsQuery[0] ? SettingsQuery[0] : {};

  const SerialNumber = req.header("SerialNumber")
    ? req.header("SerialNumber")
    : req?.query?.SerialNumber;

  const MacAddress = req.header("MacAddress")
    ? req.header("MacAddress")
    : req?.query?.MacAddress;

  const IP = res.getHeader("IP");

  const Code = req.header("Code") ? req.header("Code") : req?.query?.Code;

  const Tag = req.header("Tag") ? req.header("Tag") : req?.query?.Tag;
  //set the header to send mp4 video
  // res.setHeader("Content-Type", "video/mp4");

  const { id } = req.params;

  const SessionQuery = await SessionsDB.findOne({
    _id: new ObjectId(id),
  });

  if (!SessionQuery) return res.status(404).json({ message: NotFound }).end();

  const {
    Url,
    MacAddress: SessionMacAddress,
    SerialNumber: SessionSerialNumber,
    Code: SessionCode,
    IP: SessionIP,
    Expired,
    Type,
    EpisodeID,
  } = SessionQuery ? SessionQuery : {};

  if (Url == "") return res.status(404).json({ message: NotFound }).end();

  //Range: bytes=0-

  // if (
  //   req.header("Range") == "bytes=0-" ||
  //   req.header("Range") == "bytes=0-0" ||
  //   req.header("Range") == "0-0" ||
  //   Type == "Lives"
  // ) {
  //   if ( Expired )
  //   {
  //     console.error("Expired.");
  //     return res.status( 404 ).json({message: NotFound});
  //   }
  //   await SessionsDB.updateOne(
  //     { _id: new ObjectId(id) },
  //     {
  //       $set: { Expired: true },
  //     }
  //   );
  // }

  if (
    SessionIP != IP ||
    SessionMacAddress != MacAddress ||
    SessionSerialNumber != SerialNumber ||
    SessionCode != Code
  ) {
    console.log(
      `SessionMacAddress != MacAddress: ${SessionMacAddress != MacAddress}`
    );
    return res.status(401).json({ message: UnAuhtorized })?.end?.();
  }

  let Headers = await GetHeaders(Url);

  console.info(Headers?.statusCode, 1);
  if (
    Headers?.statusCode != 403 &&
    Headers?.statusCode != 406 &&
    Headers?.statusCode != 404 &&
    Headers?.statusCode != 500
  ) {
    console.log("Starting to send video.");

    try {
      const GetViews = await LiveViewsDB.find({
        Serial: SessionSerialNumber,
        CodeUsed: SessionCode,
      }).toArray();

      for (let index = 0; index < GetViews.length; index++) {
        const element = GetViews[index];
        const ID = element?.ID;

        Socket.emit(`ChannelViews`, {
          // LiveViews: ViewsEnd,
          ID: `${ID}`,
          Status: false,
        });
      }

      await LiveViewsDB.deleteMany({
        Serial: SessionSerialNumber,
        CodeUsed: SessionCode,
      });
    } catch (error) {}

    try {
      //Check if req.headers includes a host header
      if (req?.header?.("Host")) {
        delete req.headers["host"];
      }

      // Request with no cache
      const Headers = req.headers ? req.headers : {};
      Headers["Cache-Control"] = "no-cache";
      Headers["Pragma"] = "no-cache";
      Headers["Expires"] = "0";

      // const GetStream = await axios.get(Url, {
      //   headers: Headers,
      //   responseType: "stream",
      // });

      let GetStream = {};
      if (Type == "Series" || Type == "Movies") {
        GetStream = request(Url, { headers: Headers });
        GetStream?.pipe?.(res);
      } else {
        GetStream = await nodeFetch(Url, {
          headers: Headers,
          method: "GET",
        });

        GetStream?.body?.pipe?.(res);
      }
      Views += 1;

      console.log(`Views: ${Views}`);

      Socket.emit(`ChannelViews`, {
        ID: `${EpisodeID}`,
        Status: true,
        Serial: SessionSerialNumber,
        CodeUsed: SessionCode,
        StartedAt: new Date(),
        SessionID: `${id}`,
        Country: Country,
      });

      const FinishedConnection = async () => {
        Socket.emit(`ChannelViews`, {
          ID: `${EpisodeID}`,
          Status: false,
        });

        GetStream?.destroy?.();
        GetStream?.end?.();
        res?.end?.();
        req?.destroy?.();
        console.log("Called FinishedConnection.", EpisodeID);
      };

      try {
        res.once("close", () => {
          FinishedConnection();
        });
      } catch (error) {}
    } catch (error) {
      Socket.emit(`ChannelViews`, {
        // LiveViews: ViewsEnd,
        ID: `${EpisodeID}`,
        Status: false,
      });
      console.error(error);
      return res.status(404).json({ message: NotFound }).end();
    }
  } else {
    console.error(`Can't find stream.`);
    return res.status(404).json({ message: NotFound }).end();
  }
  // if (Type == "Lives") {
  //   got.stream(Url, { headers: req.headers }).pipe(res);
  // } else {
  //   got.stream(Url, { headers: req.headers }).pipe(res);
  // }
});

router.get("/permanent/:id", async (req, res) => {
  const Country = res.getHeader("Country");
  const { SK } = req.query;

  let SettingsQuery = await SettingsDB.find({}).toArray();

  const { UnAuhtorized, NotFound } = SettingsQuery[0] ? SettingsQuery[0] : {};

  if (SK != "pokefijwughfq09wooiqwjhfohqw")
    return res.status(401).json({ message: UnAuhtorized }).end();

  // const SerialNumber = req.header("SerialNumber")
  //   ? req.header("SerialNumber")
  //   : req?.query?.SerialNumber;

  // const MacAddress = req.header("MacAddress")
  //   ? req.header("MacAddress")
  //   : req?.query?.MacAddress;

  // const IP = res.getHeader("IP");

  // const Code = req.header("Code") ? req.header("Code") : req?.query?.Code;

  // const Tag = req.header("Tag") ? req.header("Tag") : req?.query?.Tag;
  //set the header to send mp4 video
  // res.setHeader("Content-Type", "video/mp4");

  const { id } = req.params;

  const SessionQuery = await SessionsDB.findOne({
    _id: new ObjectId(id),
  });

  if (!SessionQuery) return res.status(404).json({ message: NotFound }).end();

  const {
    Url,
    MacAddress: SessionMacAddress,
    SerialNumber: SessionSerialNumber,
    Code: SessionCode,
    IP: SessionIP,
    Expired,
    Type,
    EpisodeID,
  } = SessionQuery ? SessionQuery : {};

  if (Url == "") return res.status(404).json({ message: NotFound }).end();

  //Range: bytes=0-

  // if (
  //   req.header("Range") == "bytes=0-" ||
  //   req.header("Range") == "bytes=0-0" ||
  //   req.header("Range") == "0-0" ||
  //   Type == "Lives"
  // ) {
  //   if ( Expired )
  //   {
  //     console.error("Expired.");
  //     return res.status( 404 ).json({message: NotFound});
  //   }
  //   await SessionsDB.updateOne(
  //     { _id: new ObjectId(id) },
  //     {
  //       $set: { Expired: true },
  //     }
  //   );
  // }

  // if (
  //   SessionIP != IP ||
  //   SessionMacAddress != MacAddress ||
  //   SessionSerialNumber != SerialNumber ||
  //   SessionCode != Code
  // ) {
  //   console.log(
  //     `SessionMacAddress != MacAddress: ${SessionMacAddress != MacAddress}`
  //   );
  //   return res.status(401).json({ message: UnAuhtorized })?.end?.();
  // }

  let Headers = await GetHeaders(Url);

  console.info(Headers?.statusCode, 2);
  if (
    Headers?.statusCode != 403 &&
    Headers?.statusCode != 406 &&
    Headers?.statusCode != 404 &&
    Headers?.statusCode != 500
  ) {
    console.log("Starting Stream");

    try {
      const GetViews = await LiveViewsDB.find({
        Serial: SessionSerialNumber,
        CodeUsed: SessionCode,
      }).toArray();

      for (let index = 0; index < GetViews.length; index++) {
        const element = GetViews[index];
        const ID = element?.ID;

        Socket.emit(`ChannelViews`, {
          // LiveViews: ViewsEnd,
          ID: `${ID}`,
          Status: false,
        });
      }

      await LiveViewsDB.deleteMany({
        Serial: SessionSerialNumber,
        CodeUsed: SessionCode,
      });
    } catch (error) {}

    try {
      //Check if req.headers includes a host header
      if (req?.header?.("Host")) {
        delete req.headers["host"];
      }

      // Request with no cache
      const Headers = req.headers ? req.headers : {};
      Headers["Cache-Control"] = "no-cache";
      Headers["Pragma"] = "no-cache";
      Headers["Expires"] = "0";

      // const GetStream = await axios.get(Url, {
      //   headers: Headers,
      //   responseType: "stream",
      // });

      let controller = new AbortController();
      let signal = controller.signal;

      let GetStream = {};
      if (Type == "Series" || Type == "Movies") {
        GetStream = request(Url, { headers: Headers });
        GetStream?.pipe?.(res);
      } else {
        GetStream = await nodeFetch(Url, {
          headers: Headers,
          method: "GET",
          signal,
        });

        GetStream = GetStream?.body;

        GetStream?.pipe?.(res);
      }

      // let GetStream = request(Url, { headers: Headers });
      // GetStream?.pipe?.(res);

      Views += 1;

      console.log(`Views: ${Views}`);

      Socket.emit(`ChannelViews`, {
        ID: `${EpisodeID}`,
        Status: true,
        Serial: SessionSerialNumber,
        CodeUsed: SessionCode,
        StartedAt: new Date(),
        SessionID: `${id}`,
        Country: Country,
      });

      const FinishedConnection = async () => {
        Socket.emit(`ChannelViews`, {
          ID: `${EpisodeID}`,
          Status: false,
        });

        try {
          controller?.abort?.();
        } catch (error) {}

        GetStream?.destroy?.();
        GetStream?.end?.();
        res?.end?.();
        req?.destroy?.();
        console.log("Called FinishedConnection.", EpisodeID);
      };

      try {
        res.once("close", () => {
          FinishedConnection();
        });
      } catch (error) {}
    } catch (error) {
      Socket.emit(`ChannelViews`, {
        // LiveViews: ViewsEnd,
        ID: `${EpisodeID}`,
        Status: false,
      });
      console.error(error);
      return res.status(404).json({ message: NotFound }).end();
    }
  } else {
    console.error(`Can't find stream.`);
    return res.status(404).json({ message: NotFound }).end();
  }
  // if (Type == "Lives") {
  //   got.stream(Url, { headers: req.headers }).pipe(res);
  // } else {
  //   got.stream(Url, { headers: req.headers }).pipe(res);
  // }
});

const GetHeaders = async (url) => {
  return new Promise(async (resolve) => {
    if (url == "") return resolve({});

    const Headers = {};
    Headers["Cache-Control"] = "no-cache";
    Headers["Pragma"] = "no-cache";
    Headers["Expires"] = "0";

    const response = await nodeFetch(url, {
      method: "HEAD",
      headers: Headers,
    });

    // const res = await axios.get(url, {
    //   method: "HEAD",
    //   headers: Headers,
    // });

    const HeadersData = {
      ...response.headers,
      statusCode: response.headers.get("status")
        ? response.headers.get("status")
        : response.status,
    };

    resolve(HeadersData);
  });
};

router.get("/Create/:EpisodeID/:Type", async (req, res) => {
  const Country = res.getHeader("Country");
  const IP = res.getHeader("IP");
  const SerialNumber = req.header("SerialNumber")
    ? req.header("SerialNumber")
    : req?.query?.SerialNumber;
  const MacAddress = req.header("MacAddress")
    ? req.header("MacAddress")
    : req?.query?.MacAddress;
  const Code = req.header("Code") ? req.header("Code") : req?.query?.Code;

  const { EpisodeID, Type } = req.params;

  let Episode = undefined;
  if (Type == "Series") {
    Episode = await EpisodesDB.findOne({ _id: new ObjectId(EpisodeID) });
  } else if (Type == "Movies") {
    Episode = await MoviesDB.findOne({ _id: new ObjectId(EpisodeID) });
  } else if (Type == "Lives") {
    Episode = await LiveDB.findOne({ _id: new ObjectId(EpisodeID) });
  }
  if (!Episode) return res.status(404).sendStatus(404)?.end?.();

  let Session = {};
  Session.EpisodeID = EpisodeID;
  Session.TypeID = Type === "Series" ? Episode?.Series : Type;
  Session.Country = Country;
  Session.MacAddress = MacAddress;
  Session.SerialNumber = SerialNumber;
  Session.Code = Code;
  Session.Url = Episode.Url;
  Session.IP = IP;
  Session.Expired = false;
  Session.Type = Type;

  let Data = await SessionsDB.insertOne(Session);

  res
    .status(Data.insertedId ? 200 : 500)
    .json({ id: Data.insertedId, message: "" })
    ?.end?.();

  Episode = undefined;
  Data = undefined;
  Session = undefined;
});

export default router;
