import express from "express";
import Dotenv from "dotenv";
Dotenv.config();

import DatabaseInit from "../Database/index.mjs";
const router = express.Router();
const RootDB = await DatabaseInit();
const DB = RootDB.SubCategories;
const LivesDB = RootDB.Live;
const SeriesDB = RootDB.Series;
const MoviesDB = RootDB.Movies;
const CodeDB = RootDB.ActivationCodes;

router.get("/:Category", async (req, res) => {
  const Country = res.getHeader("Country");
  const ExpiryDate = res.getHeader("expiration_date");
  const Code = res.getHeader("Code");

  const CodeQuery = await CodeDB.findOne({
    Code: Code,
  });
  const { Code: CodeFromQuery, _id: CodeID } = CodeQuery ? CodeQuery : {};
  if (CodeFromQuery !== Code) return res.status(401).send("Invalid Code");

  const { Category } = req.params;

  const SubCategoriesCount = await DB.count({
    SubCategoriesAllowed: `${CodeID}`,
  });

  console.log({
    SubCategoriesAllowed: `${CodeID}`,
  });

  let Data = [];

  console.log(`Sub Categories Count: ${SubCategoriesCount}`);
  if (SubCategoriesCount <= 0) {
    Data = await DB.find({
      Category: Category,
    })
      .sort({ Position: 1 })
      .toArray();
  } else {
    Data = await DB.find({
      Category: Category,
      SubCategoriesAllowed: `${CodeID}`,
    })
      .sort({ Position: 1 })
      .toArray();
  }

  console.log(`Data: ${JSON.stringify(Data, null, 2)}`);

  const NewArray = [];

  for (let i = 0; i < Data.length; i++) {
    const { _id } = Data[i];
    const Lives = await LivesDB.count({ SubCategory: `${_id}`, Status: true });
    const Series = await SeriesDB.count({ SubCategory: `${_id}` });
    const Movies = await MoviesDB.count({ SubCategory: `${_id}` });

    if (Lives >= 1 || Series >= 1 || Movies >= 1) {
      NewArray.push(Data[i]);
    }
  }

  res.status(200).json({ Data: NewArray, ExpiryDate, message: "" })?.end?.();
});

export default router;
