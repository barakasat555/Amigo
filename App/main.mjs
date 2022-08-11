//Express server
import express from "express";
import helmet from "helmet";
import Dotenv from "dotenv";

import path from "path";

import requestIp from "request-ip";

import DatabaseInit from "./Database/index.mjs";

import cors from "cors";

import geoIp from "geoip-country";

import fs from "fs";
const router = express.Router();
const Connection1 = await DatabaseInit();
const CountriesDB = Connection1.Countries;
const ActivationCodesDB = Connection1.ActivationCodes;
const SerialsDB = Connection1.Serials;
const ClientsDB = Connection1.Clients;
const TagsDB = Connection1.Tags;
const SettingsDB = Connection1.Settings;
const ImagesDB = Connection1.Images;
const SystemUsersDB = Connection1.SystemUsers;
const PeriodsDB = Connection1.Periods;

Dotenv.config();
const Port = process.env.PORT;

const app = express();

import GeneralMiddleWare from "./GeneralMiddleWare.mjs";
//Create a middleware function that set the header

// console.log = function () {};
// console.warn = function () {};
// console.error = function () {};

import SwaggerRoutes from "./SwaggerRoute/index.mjs";

setTimeout(() => {
  process.exit(0);
}, 1000 * 60 * 60 * 1);

app.use("/documentation", SwaggerRoutes);

app.use("/", (req, res, next) => {
  console.log(`Instance: ${process?.env?.pm_id}, Name: ${process?.env?.name}`);
  next();
});

app.get(
  "/Images/:image",
  // await GeneralMiddleWare(
  //   CountriesDB,
  //   ActivationCodesDB,
  //   SerialsDB,
  //   ClientsDB,
  //   TagsDB,
  //   SystemUsersDB
  // ),
  async (req, res) => {
    const Image = await ImagesDB.findOne({ filename: req.params.image });
    // console.log(Image);
    if (Image) {
      const ExtenstionFile = Image?.ext;
      const ImageBase64 = Image?.Image;
      const filename = Image?.filename;

      // res.setHeader("Content-Type", `image/${ExtenstionFile}`);

      const uploadPath = `${path.resolve()}/images/`;

      const fileType = ImageBase64.substring(
        "data:".length,
        ImageBase64.indexOf("/")
      );
      const regex = new RegExp(
        `^data:${fileType}\/${ExtenstionFile};base64,`,
        "gi"
      );

      const base64Data = ImageBase64.replace(regex, "");

      //ImageBuffer is a buffer convert it to an actual image and save it
      //Check if the file exists if not create it on the disk

      if (fs.existsSync(`${uploadPath}${filename}`)) {
        res.sendFile(`${uploadPath}${filename}`);
      } else {
        fs.writeFileSync(`${uploadPath}${filename}`, base64Data, "base64");
        res.sendFile(`${uploadPath}${filename}`);
      }
      // try {
      //   fs.unlinkSync(`${uploadPath}${filename}`);
      // } catch (error) {}
      //Delete file from server
    } else {
      return res.status(404).send("Image not found")?.end?.();
    }
  }
);

app.use(express.json({ limit: "100mb" }));

import morgan from "morgan";
app.use(morgan("dev"));

// const endpointsFiles = [
//   "./Categories/index.mjs",
//   "SubCategories/index.mjs",
//   "./Movies/index.mjs",
//   "./Live/index.mjs",
//   "./Series/index.mjs",
//   "./Sessions/index.mjs",
// ];

// /* NOTE: if you use the express Router, you must pass in the
//    'endpointsFiles' only the root file where the route starts,
//    such as: index.js, app.js, routes.js, ... */

app.use(cors());
app.options("*", cors()); // include before other routes

app.use(requestIp.mw());

app.get("/Code/IR", (req, res) => {
  return res.status(200).json({ Code: "9999999999" })?.end?.();
});

app.get("/Code/IX", (req, res) => {
  return res.status(200).json({ Code: "3333333333" })?.end?.();
});

app.get("/Code/MX", (req, res) => {
  return res.status(200).json({ Code: "4444444444" })?.end?.();
});

app.get("/Code/ZERO", (req, res) => {
  return res.status(200).json({ Code: "2222222222" })?.end?.();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true, parameterLimit: 10 }));
//Allow cross origin requests in helmet
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

//Routes
import MoviesRoutes from "./Movies/index.mjs";
app.use(
  "/Movies",
  await GeneralMiddleWare(
    CountriesDB,
    ActivationCodesDB,
    SerialsDB,
    ClientsDB,
    TagsDB,
    SettingsDB,
    SystemUsersDB,
    PeriodsDB
  ),
  MoviesRoutes
);

import SeriesRoutes from "./Series/index.mjs";
app.use(
  "/Series",
  await GeneralMiddleWare(
    CountriesDB,
    ActivationCodesDB,
    SerialsDB,
    ClientsDB,
    TagsDB,
    SettingsDB,
    SystemUsersDB,
    PeriodsDB
  ),
  SeriesRoutes
);

import LiveRoutes from "./Live/index.mjs";
app.use(
  "/Lives",
  await GeneralMiddleWare(
    CountriesDB,
    ActivationCodesDB,
    SerialsDB,
    ClientsDB,
    TagsDB,
    SettingsDB,
    SystemUsersDB,
    PeriodsDB
  ),
  LiveRoutes
);

import CategoriesRoutes from "./Categories/index.mjs";
app.use(
  "/Categories",
  await GeneralMiddleWare(
    CountriesDB,
    ActivationCodesDB,
    SerialsDB,
    ClientsDB,
    TagsDB,
    SettingsDB,
    SystemUsersDB,
    PeriodsDB
  ),
  CategoriesRoutes
);

import SubCategoriesRoutes from "./SubCategories/index.mjs";
app.use(
  "/SubCategories",
  await GeneralMiddleWare(
    CountriesDB,
    ActivationCodesDB,
    SerialsDB,
    ClientsDB,
    TagsDB,
    SettingsDB,
    SystemUsersDB,
    PeriodsDB
  ),
  SubCategoriesRoutes
);

import SessionsRoutes from "./Sessions/index.mjs";
app.use(
  "/Sessions",
  await GeneralMiddleWare(
    CountriesDB,
    ActivationCodesDB,
    SerialsDB,
    ClientsDB,
    TagsDB,
    SettingsDB,
    SystemUsersDB,
    PeriodsDB
  ),
  SessionsRoutes
);

import AdminRoutes from "./admin/index.mjs";
app.use("/Admin", AdminRoutes);

app.use("/", (req, res, next) => {
  let ip;

  if (
    req.headers["cf-connecting-ip"] &&
    req.headers["cf-connecting-ip"].split(", ").length
  ) {
    let first = req.headers["cf-connecting-ip"].split(", ");
    ip = first[0];
  } else {
    ip =
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
  }

  if (ip == "::1") {
    ip = "Default";
  }

  const geo = ip == "Default" ? { country: "JO" } : geoIp.lookup(ip);

  console.log(process.env.PORT);
  console.error(ip, geo?.country);
  next();
});

app.get("/testing", (req, res) => {
  let ip;

  if (
    req.headers["cf-connecting-ip"] &&
    req.headers["cf-connecting-ip"].split(", ").length
  ) {
    let first = req.headers["cf-connecting-ip"].split(", ");
    ip = first[0];
  } else {
    ip =
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
  }

  if (ip == "::1") {
    ip = "Default";
  }

  const geo = ip == "Default" ? { country: "JO" } : geoIp.lookup(ip);

  const Country = geo;

  console.log(`The Country is: ${Country?.country?.toLowerCase?.()}`);

  if (Country?.country?.toLowerCase?.() == "sa") {
    return res.status(200).json({ message: "Black Landing page." })?.end?.();
  }
  if (Country?.country?.toLowerCase?.() == "tr") {
    return res.status(200).json({ message: "White Landing page." })?.end?.();
  }

  return res
    .status(200)
    .json({ message: "In the middle Landing page." })
    ?.end?.();
});

app.get("/", function (req, res) {
  res.status(200).json({}).end();
});

process.on("uncaughtException", function (err) {
  console.error(err);
});

app.listen(Port, () => {
  console.log(
    `Server is running on port ${Port} In ${process.env.NODE_ENV} mode.`
  );
});
