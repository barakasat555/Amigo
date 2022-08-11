import express from "express";
import Dotenv from "dotenv";
Dotenv.config();

import DatabaseInit from "../Database/index.mjs";
const router = express.Router();
const RootDB = await DatabaseInit();
const DB = RootDB.Movies;

router.get("/:SubCategory", async (req, res) => {
  const Country = res.getHeader("Country");

  const { SubCategory } = req.params;
  console.log(SubCategory);

  const Data = await DB.find(
    { SubCategory: SubCategory },
    {
      projection: {
        Url: 0,
      },
    }
  )
    .sort({ _id: -1 })
    .toArray();

  res.status(200).json({ Data: Data, message: "" });
});

export default router;
