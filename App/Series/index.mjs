import express from "express";
import Dotenv from "dotenv";
Dotenv.config();

import DatabaseInit from "../Database/index.mjs";
const router = express.Router();
const RootDB = await DatabaseInit();
const DB = RootDB.Series;
const EpisodesDB = RootDB.Episodes;
const SettingsDB = RootDB.Settings;

// console.log = function () {};
// console.warn = function () {};
// console.error = function () {};


router.get("/:SubCategory", async (req, res) => {
  const Country = res.getHeader("Country");

  const { SubCategory } = req.params;
  console.log(SubCategory);

  const SettingsQuery = await SettingsDB.find({}).toArray();

  const { IsSeriesSortingASC } = SettingsQuery[0] ? SettingsQuery[0] : {};

  const Data = await DB.find(
    { SubCategory: SubCategory },
    {
      projection: {
        Url: 0,
        CreatedBy: 0,
      },
    }
  )
    .sort({ _id: IsSeriesSortingASC ? -1 : 1 })
    .toArray();

  res.status(200).json({ Data: Data });
});

router.get("/Episodes/:Series", async (req, res) => {
  const Country = res.getHeader("Country");

  const { Series } = req.params;

  const Data = await EpisodesDB.find(
    { Series: Series },
    {
      projection: {
        Url: 0,
        CreatedBy: 0,
        IsUpload: 0,
      },
    }
  ).toArray();

  res.status(200).json({ Data: Data });
});

export default router;
