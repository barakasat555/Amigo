import express from "express";
import Dotenv from "dotenv";
Dotenv.config();

import DatabaseInit from "../Database/index.mjs";

// import fetch from "node-fetch";
// import request from "request";
const router = express.Router();
const RootDB = await DatabaseInit();
const DB = RootDB.Live;

router.get("/:SubCategory", async (req, res) => {
  const Country = res.getHeader("Country");

  const { SubCategory } = req.params;

  const Data = await DB.find(
    { SubCategory: SubCategory, Status: true },
    {
      projection: {
        Url: 0,
      },
    }
  ).toArray();

  res.status(200).json({ Data: Data, IsLive: true, message: "" })?.end?.();
});

export default router;
