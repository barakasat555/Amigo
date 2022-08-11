import express from "express";
import Dotenv from "dotenv";
Dotenv.config();

import DatabaseInit from "../Database/index.mjs";
const router = express.Router();
const RootDB = await DatabaseInit();
const DB = RootDB.Categories;
const CodeDB = RootDB.ActivationCodes;
const SubCategoriesDB = RootDB.SubCategories;

router.get("/", async (req, res) => {
  const Country = res.getHeader("Country");
  const ExpiryDate = res.getHeader("expiration_date");

  const Code = res.getHeader("Code");

  const CodeQuery = await CodeDB.findOne({
    Code: Code,
  });
  const { Code: CodeFromQuery, _id: CodeID } = CodeQuery ? CodeQuery : {};
  if (CodeFromQuery !== Code) return res.status(401).send("Invalid Code");

  const Data = await DB.find({}).toArray();

  let NewCategories = [];
  let IsOneFound = false;
  const CategoriesToRemove = [];
  for (let index = 0; index < Data.length; index++) {
    const Category = Data[index];
    const { _id } = Category;
    const SubCategoriesCount = await SubCategoriesDB.count({
      SubCategoriesAllowed: `${CodeID}`,
      Category: `${_id}`,
    });
    if (SubCategoriesCount <= 0) {
      NewCategories.push(Category);
      CategoriesToRemove.push(`${_id}`);
    } else {
      IsOneFound = true;
    }
  }

  if (IsOneFound) {
    // Find All Categories that have at least 1 subcategory allowed
    NewCategories = Data.filter((Category) => {
      return !CategoriesToRemove.includes(`${Category._id}`);
    });
  }

  NewCategories.sort((a, b) => a.position - b.position); // b - a for reverse sort

  res.status(200).json({ Data: NewCategories, ExpiryDate, message: "" }).end();
});

export default router;
